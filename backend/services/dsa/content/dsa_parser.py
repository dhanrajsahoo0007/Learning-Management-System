"""
Parses a single DSA problem file into a `Problem`.

The corpus is not uniformly formatted: only 43% of files carry a docstring,
headers vary ("Problem Statement:", "Problem:", and a "Problem Staement" typo),
and solutions appear in three shapes -- a `class Solution`, a set of bare
top-level functions, or a plain class such as `LRUCache`. This parser handles
all of them and treats an empty file as a pending curriculum entry rather than
an error.
"""

import ast
import re
import textwrap
from pathlib import Path
from typing import List, Optional

from dsa_schema import (
    STATUS_PENDING,
    STATUS_SOLVED,
    ComplexityAnalysis,
    Example,
    Problem,
    Solution,
)
from topics_meta import FOLDER_TO_TOPIC

# "01. Two Sum" -> order 1. Requires the dot so a title like "2 Sum" is intact.
ORDER_PREFIX = re.compile(r"^\s*(\d+)\s*\.\s*")

STATEMENT_HEADER = re.compile(
    r"^\s*Problem\s*(?:Statement|Staement|Statment)?\s*[:\-]?\s*", re.I
)
EXAMPLE_RE = re.compile(r"^\s*Example\s*\d*\s*[:\-]", re.I)
CONSTRAINTS_RE = re.compile(r"^\s*Constraints?\s*[:\-]", re.I)
SECTION_BREAK = re.compile(r"^\s*(Note|Follow[ -]?up|Solution|Approach)\s*[:\-]", re.I)
LABEL_RE = re.compile(
    r"^\s*(Input|Output|Expected Output|Explanation)\s*[:\-]\s*(.*)$", re.I
)
DIFFICULTY_RE = re.compile(r"Difficulty\s*[:\-]\s*(Easy|Medium|Hard)\b", re.I)

TIME_RE = re.compile(r"Time\s*Complexity[^\n]*?(O\s*\([^)\n]*\)[^,\n]*)", re.I)
SPACE_RE = re.compile(r"Space\s*Complexity[^\n]*?(O\s*\([^)\n]*\)[^,\n]*)", re.I)
TIME_SHORT_RE = re.compile(r"\bTime\s*[:=]\s*(O\s*\([^)\n]*\))", re.I)
SPACE_SHORT_RE = re.compile(r"\bSpace\s*[:=]\s*(O\s*\([^)\n]*\))", re.I)

# Files that belong to the extraction toolchain rather than the curriculum.
TOOLING_FILES = {
    "dsa_parser.py",
    "dsa_schema.py",
    "topics_meta.py",
    "extract.py",
    "batch_extract.py",
    "extract_all.py",
    "test_dsa_parser.py",
}


def strip_order_prefix(name: str) -> str:
    return ORDER_PREFIX.sub("", name).strip()


def order_number(name: str) -> Optional[int]:
    match = ORDER_PREFIX.match(name)
    return int(match.group(1)) if match else None


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", strip_order_prefix(text).lower()).strip("-")
    return slug or "item"


def segment_sort_key(name: str) -> str:
    """Sortable segment: numeric prefix first, then the slug as a tiebreaker.

    Unnumbered folders sort after numbered ones, which matches how the tree
    reads on disk.
    """
    number = order_number(name)
    return f"{number:04d}~{slugify(name)}" if number is not None else f"9999~{slugify(name)}"


def _dedent_body(text: str) -> str:
    """Strip the common indent from every line after the first.

    Docstrings here start flush against the opening quotes and indent the rest,
    so a plain textwrap.dedent would not find a shared prefix.
    """
    lines = text.splitlines()
    if len(lines) < 2:
        return text.strip()
    rest = [line for line in lines[1:] if line.strip()]
    if not rest:
        return lines[0].strip()
    indent = min(len(line) - len(line.lstrip()) for line in rest)
    out = [lines[0].strip()] + [line[indent:] if len(line) > indent else line.strip() for line in lines[1:]]
    return "\n".join(out).strip()


def _is_driver_function(name: str) -> bool:
    return name.startswith("_") or name.startswith("test") or name in {"main", "run"}


def _first_match(pattern: re.Pattern, text: str) -> Optional[str]:
    match = pattern.search(text)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else None


class ProblemParser:
    def __init__(self, path: Path, root: Path):
        self.path = path
        self.root = root
        self.relative = path.relative_to(root)
        self.source = path.read_text(encoding="utf-8", errors="replace")
        self.lines = self.source.splitlines()
        try:
            self.tree: Optional[ast.Module] = ast.parse(self.source)
        except SyntaxError:
            self.tree = None

    # ---------------------------------------------------------------- identity

    def _identity(self):
        parts = list(self.relative.parts)
        topic_folder = parts[0]
        stem = Path(parts[-1]).stem
        middle = parts[1:-1]

        topic_id = FOLDER_TO_TOPIC.get(topic_folder.strip(), slugify(topic_folder))
        problem_id = "/".join(
            [slugify(topic_folder)] + [slugify(part) for part in middle] + [slugify(stem)]
        )
        sort_key = "/".join(
            [segment_sort_key(part) for part in [topic_folder] + list(middle)]
            + [segment_sort_key(stem)]
        )
        sections = [strip_order_prefix(part) for part in middle]
        title = re.sub(r"\s+", " ", strip_order_prefix(stem)).strip() or stem
        return topic_id, problem_id, sort_key, sections, title

    # ------------------------------------------------------------- docstrings

    def _docstring(self) -> Optional[str]:
        return ast.get_docstring(self.tree) if self.tree else None

    def _statement(self, doc: str) -> str:
        lines = doc.splitlines()
        cut = len(lines)
        for index, line in enumerate(lines):
            if EXAMPLE_RE.match(line) or CONSTRAINTS_RE.match(line):
                cut = index
                break
        body = "\n".join(lines[:cut])
        body = STATEMENT_HEADER.sub("", body, count=1)
        return _dedent_body(body)

    def _examples(self, doc: str) -> List[Example]:
        blocks: List[List[str]] = []
        current: Optional[List[str]] = None
        for line in doc.splitlines():
            if EXAMPLE_RE.match(line):
                if current is not None:
                    blocks.append(current)
                current = []
                continue
            if current is None:
                continue
            if CONSTRAINTS_RE.match(line) or SECTION_BREAK.match(line):
                blocks.append(current)
                current = None
                continue
            current.append(line)
        if current is not None:
            blocks.append(current)

        examples: List[Example] = []
        for block in blocks:
            fields = {"input": [], "output": [], "explanation": []}
            active: Optional[str] = None
            for line in block:
                label = LABEL_RE.match(line)
                if label:
                    key = label.group(1).lower()
                    active = "output" if key == "expected output" else key
                    value = label.group(2).strip()
                    if value:
                        fields[active].append(value)
                    continue
                if active and line.strip():
                    fields[active].append(line.strip())
            joined = {key: " ".join(value).strip() for key, value in fields.items()}
            if joined["input"] and joined["output"]:
                examples.append(
                    Example(
                        input=joined["input"],
                        output=joined["output"],
                        explanation=joined["explanation"] or None,
                    )
                )
        return examples

    def _constraints(self, doc: str) -> Optional[str]:
        collected: List[str] = []
        active = False
        for line in doc.splitlines():
            if CONSTRAINTS_RE.match(line):
                active = True
                remainder = CONSTRAINTS_RE.sub("", line).strip()
                if remainder:
                    collected.append(remainder)
                continue
            if not active:
                continue
            if EXAMPLE_RE.match(line) or SECTION_BREAK.match(line):
                break
            if not line.strip():
                if collected:
                    break
                continue
            collected.append(line.strip())
        return "\n".join(collected) or None

    def _notes(self) -> Optional[str]:
        """Trailing module-level docstrings, which authors used for write-ups."""
        if not self.tree:
            return None
        chunks = []
        for index, node in enumerate(self.tree.body):
            if index == 0:
                continue
            if (
                isinstance(node, ast.Expr)
                and isinstance(node.value, ast.Constant)
                and isinstance(node.value.value, str)
            ):
                text = _dedent_body(node.value.value)
                if text:
                    chunks.append(text)
        return "\n\n".join(chunks) or None

    # -------------------------------------------------------------- solutions

    def _source_of(self, node: ast.AST) -> str:
        return (ast.get_source_segment(self.source, node) or "").rstrip()

    @staticmethod
    def _join(parts: List[str]) -> str:
        return "\n\n".join(part.strip() for part in parts if part and part.strip()).strip()

    def _complexity(self, node: Optional[ast.AST]) -> Optional[ComplexityAnalysis]:
        if node is not None and getattr(node, "end_lineno", None):
            window = "\n".join(self.lines[node.end_lineno : node.end_lineno + 40])
        else:
            window = self.source
        time = _first_match(TIME_RE, window) or _first_match(TIME_SHORT_RE, window)
        space = _first_match(SPACE_RE, window) or _first_match(SPACE_SHORT_RE, window)
        if not time and not space:
            return None
        return ComplexityAnalysis(time=time, space=space)

    def _entry_functions(self, functions: List[ast.AST]) -> List[ast.AST]:
        """Functions that no sibling calls, i.e. the ones a reader starts from."""
        names = {fn.name for fn in functions}
        called = set()
        for fn in functions:
            for node in ast.walk(fn):
                if isinstance(node, ast.Name) and node.id in names and node.id != fn.name:
                    called.add(node.id)
        entries = [fn for fn in functions if fn.name not in called]
        return entries or functions

    def _solutions(self) -> List[Solution]:
        if not self.tree:
            # Unparseable but non-empty: keep the raw file so nothing is lost.
            body = self.source.strip()
            return [Solution(language="python", code=body, name="Solution")] if body else []

        imports, classes, functions, constants = [], [], [], []
        last_definition = -1
        for index, node in enumerate(self.tree.body):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                imports.append(node)
            elif isinstance(node, ast.ClassDef):
                classes.append(node)
                last_definition = index
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                functions.append(node)
                last_definition = index
        # Assignments before the last def are module constants; anything after
        # is driver code such as `solution = Solution()`.
        for index, node in enumerate(self.tree.body):
            if isinstance(node, ast.Assign) and index < last_definition:
                constants.append(node)

        functions = [fn for fn in functions if not _is_driver_function(fn.name)]
        solution_classes = [cls for cls in classes if cls.name.lower() == "solution"]
        helper_classes = [cls for cls in classes if cls.name.lower() != "solution"]

        prelude = (
            [self._source_of(node) for node in imports]
            + [self._source_of(node) for node in constants]
            + [self._source_of(node) for node in helper_classes]
        )

        # A `class Solution` holding several public methods means several approaches.
        if solution_classes:
            cls = solution_classes[0]
            methods = [
                node
                for node in cls.body
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
                and not node.name.startswith("_")
            ]
            if len(methods) > 1:
                variants = []
                for method in methods:
                    wrapped = "class Solution:\n" + textwrap.indent(self._source_of(method), "    ")
                    variants.append(
                        Solution(
                            language="python",
                            code=self._join(prelude + [wrapped]),
                            name=method.name,
                            complexity=self._complexity(method),
                        )
                    )
                return variants

        # Several independent top-level functions means several approaches.
        if not solution_classes and len(functions) > 1:
            entries = self._entry_functions(functions)
            if len(entries) > 1:
                helpers = [fn for fn in functions if fn not in entries]
                shared = prelude + [self._source_of(fn) for fn in helpers]
                return [
                    Solution(
                        language="python",
                        code=self._join(shared + [self._source_of(entry)]),
                        name=entry.name,
                        complexity=self._complexity(entry),
                    )
                    for entry in entries
                ]

        # Otherwise the whole file is one solution.
        code = self._join(
            prelude
            + [self._source_of(cls) for cls in solution_classes]
            + [self._source_of(fn) for fn in functions]
        )
        if not code:
            return []
        if solution_classes:
            name = solution_classes[0].name
        elif functions:
            name = functions[0].name
        elif helper_classes:
            name = helper_classes[0].name
        else:
            name = "Solution"
        return [
            Solution(
                language="python",
                code=code,
                name=name,
                complexity=self._complexity(None),
            )
        ]

    # ------------------------------------------------------------------ parse

    def parse(self) -> Problem:
        topic_id, problem_id, sort_key, sections, title = self._identity()
        doc = self._docstring()
        solutions = self._solutions()

        statement = self._statement(doc) if doc else ""
        examples = self._examples(doc) if doc else []
        constraints = self._constraints(doc) if doc else None
        difficulty = _first_match(DIFFICULTY_RE, doc) if doc else None

        return Problem(
            id=problem_id,
            topic_id=topic_id,
            title=title,
            section_path=sections,
            statement=statement,
            constraints=constraints,
            notes=self._notes(),
            examples=examples,
            solutions=solutions,
            difficulty=difficulty.title() if difficulty else None,
            status=STATUS_SOLVED if solutions else STATUS_PENDING,
            source_file=str(self.relative),
            sort_key=sort_key,
        )


def parse_problem_file(path: Path, root: Path) -> Problem:
    return ProblemParser(path, root).parse()
