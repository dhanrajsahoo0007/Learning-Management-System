// Command import applies the DSA migrations and loads the extracted curriculum
// into the database.
//
// Run the Python extractor first, then this:
//
//	cd backend/services/dsa/content && python3 extract.py
//	cd backend/services/dsa && go run ./cmd/import
//
// It is idempotent: rows are upserted by id and rows that no longer exist in
// the extracted JSON are pruned, so re-running after adding problem files is
// the normal workflow.
package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
)

// Shapes of the JSON written by content/extract.py, which uses snake_case.
type fileExample struct {
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation"`
}

type fileComplexity struct {
	Time  string `json:"time"`
	Space string `json:"space"`
}

type fileSolution struct {
	Language   string          `json:"language"`
	Code       string          `json:"code"`
	Name       string          `json:"name"`
	Complexity *fileComplexity `json:"complexity"`
}

type fileProblem struct {
	ID          string         `json:"id"`
	TopicID     string         `json:"topic_id"`
	Title       string         `json:"title"`
	SectionPath []string       `json:"section_path"`
	Statement   string         `json:"statement"`
	Constraints string         `json:"constraints"`
	Notes       string         `json:"notes"`
	Examples    []fileExample  `json:"examples"`
	Solutions   []fileSolution `json:"solutions"`
	Difficulty  string         `json:"difficulty"`
	Status      string         `json:"status"`
	SourceFile  string         `json:"source_file"`
	SortKey     string         `json:"sort_key"`
}

type fileTopic struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Category     string   `json:"category"`
	Description  string   `json:"description"`
	Difficulty   string   `json:"difficulty"`
	Icon         string   `json:"icon"`
	Color        string   `json:"color"`
	FolderPath   string   `json:"folder_path"`
	ProblemCount int      `json:"problem_count"`
	SolvedCount  int      `json:"solved_count"`
	Sections     []string `json:"sections"`
}

func main() {
	root := flag.String("root", "", "path to backend/services/dsa (defaults to the module root)")
	prune := flag.Bool("prune", true, "delete rows that are no longer present in the extracted JSON")
	flag.Parse()

	moduleRoot, err := resolveRoot(*root)
	if err != nil {
		log.Fatalf("could not locate the dsa module root: %v", err)
	}

	cfg, err := config.Load("dsa-import")
	if err != nil {
		log.Fatalf("failed to load configuration: %v", err)
	}

	db, err := database.Connect(database.Config{
		URL:       cfg.Database.URL,
		AuthToken: cfg.Database.AuthToken,
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	ctx := context.Background()

	applied, err := applyMigrations(ctx, db, filepath.Join(moduleRoot, "migrations"))
	if err != nil {
		log.Fatalf("migration failed: %v", err)
	}
	log.Printf("migrations applied: %d", applied)

	extracted := filepath.Join(moduleRoot, "content", "extracted")
	topics, err := loadTopics(filepath.Join(extracted, "dsa_topics.json"))
	if err != nil {
		log.Fatalf("failed to read topics: %v", err)
	}
	problems, err := loadProblems(filepath.Join(extracted, "dsa_problems.json"))
	if err != nil {
		log.Fatalf("failed to read problems: %v", err)
	}

	if err := importAll(ctx, db, topics, problems, *prune); err != nil {
		log.Fatalf("import failed: %v", err)
	}

	solved := 0
	for _, problem := range problems {
		if problem.Status == "solved" {
			solved++
		}
	}
	log.Printf("topics imported   : %d", len(topics))
	log.Printf("problems imported : %d (%d solved, %d pending)", len(problems), solved, len(problems)-solved)
	log.Println("done")
}

// resolveRoot finds the directory holding go.mod so the command works from any
// working directory.
func resolveRoot(override string) (string, error) {
	if override != "" {
		return filepath.Abs(override)
	}
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("no go.mod found above %s", dir)
		}
		dir = parent
	}
}

// ---------------------------------------------------------------- migrations

func applyMigrations(ctx context.Context, db *database.DB, dir string) (int, error) {
	if _, err := db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version    TEXT PRIMARY KEY,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`); err != nil {
		return 0, fmt.Errorf("create schema_migrations: %w", err)
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		return 0, fmt.Errorf("read %s: %w", dir, err)
	}
	var versions []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".sql") {
			versions = append(versions, entry.Name())
		}
	}
	sort.Strings(versions)

	count := 0
	for _, version := range versions {
		var existing string
		err := db.QueryRowContext(ctx, `SELECT version FROM schema_migrations WHERE version = ?`, version).Scan(&existing)
		if err == nil {
			continue // already applied
		}
		if err != sql.ErrNoRows {
			return count, fmt.Errorf("check migration %s: %w", version, err)
		}

		body, err := os.ReadFile(filepath.Join(dir, version))
		if err != nil {
			return count, fmt.Errorf("read migration %s: %w", version, err)
		}
		for _, statement := range splitStatements(string(body)) {
			if _, err := db.ExecContext(ctx, statement); err != nil {
				return count, fmt.Errorf("apply %s: %w", version, err)
			}
		}
		if _, err := db.ExecContext(ctx, `INSERT INTO schema_migrations (version) VALUES (?)`, version); err != nil {
			return count, fmt.Errorf("record %s: %w", version, err)
		}
		log.Printf("  applied %s", version)
		count++
	}
	return count, nil
}

// splitStatements strips line comments and splits on semicolons. The migration
// files intentionally avoid semicolons inside string literals.
func splitStatements(body string) []string {
	var cleaned []string
	for _, line := range strings.Split(body, "\n") {
		if trimmed := strings.TrimSpace(line); strings.HasPrefix(trimmed, "--") {
			continue
		}
		cleaned = append(cleaned, line)
	}
	var statements []string
	for _, chunk := range strings.Split(strings.Join(cleaned, "\n"), ";") {
		if trimmed := strings.TrimSpace(chunk); trimmed != "" {
			statements = append(statements, trimmed)
		}
	}
	return statements
}

// -------------------------------------------------------------------- import

func loadTopics(path string) ([]fileTopic, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("%s: %w (run content/extract.py first)", path, err)
	}
	var payload struct {
		Topics []fileTopic `json:"topics"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, err
	}
	return payload.Topics, nil
}

func loadProblems(path string) ([]fileProblem, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("%s: %w (run content/extract.py first)", path, err)
	}
	var payload struct {
		Problems []fileProblem `json:"problems"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, err
	}
	return payload.Problems, nil
}

func importAll(ctx context.Context, db *database.DB, topics []fileTopic, problems []fileProblem, prune bool) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	if err := upsertTopics(ctx, tx, topics); err != nil {
		return err
	}
	if err := upsertProblems(ctx, tx, problems); err != nil {
		return err
	}
	if prune {
		if err := pruneMissing(ctx, tx, "dsa_topics", topicIDs(topics)); err != nil {
			return err
		}
		if err := pruneMissing(ctx, tx, "dsa_problems", problemIDs(problems)); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func upsertTopics(ctx context.Context, tx *sql.Tx, topics []fileTopic) error {
	statement, err := tx.PrepareContext(ctx, `
		INSERT INTO dsa_topics (
			id, title, category, description, difficulty, progress, icon, color,
			folder_path, problem_count, solved_count, subcomponents, content, updated_at
		) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(id) DO UPDATE SET
			title = excluded.title,
			category = excluded.category,
			description = excluded.description,
			difficulty = excluded.difficulty,
			icon = excluded.icon,
			color = excluded.color,
			folder_path = excluded.folder_path,
			problem_count = excluded.problem_count,
			solved_count = excluded.solved_count,
			subcomponents = excluded.subcomponents,
			content = excluded.content,
			updated_at = CURRENT_TIMESTAMP`)
	if err != nil {
		return fmt.Errorf("prepare topic upsert: %w", err)
	}
	defer statement.Close()

	for _, topic := range topics {
		sections, err := json.Marshal(orEmpty(topic.Sections))
		if err != nil {
			return err
		}
		// The topic-level content blob predates per-problem data. Keep it
		// populated from the description so the overview card has copy.
		content, err := json.Marshal(map[string]any{
			"explanation":   topic.Description,
			"examples":      []any{},
			"codeTemplates": map[string]string{"javascript": "", "python": "", "java": "", "cpp": ""},
			"testCases":     []any{},
			"hints":         []any{},
			"solution":      "",
		})
		if err != nil {
			return err
		}
		if _, err := statement.ExecContext(ctx,
			topic.ID, topic.Title, topic.Category, topic.Description, topic.Difficulty,
			topic.Icon, topic.Color, topic.FolderPath, topic.ProblemCount, topic.SolvedCount,
			string(sections), string(content),
		); err != nil {
			return fmt.Errorf("upsert topic %s: %w", topic.ID, err)
		}
	}
	return nil
}

func upsertProblems(ctx context.Context, tx *sql.Tx, problems []fileProblem) error {
	statement, err := tx.PrepareContext(ctx, `
		INSERT INTO dsa_problems (
			id, topic_id, title, section_path, statement, constraints, notes,
			examples, solutions, solution_count, difficulty, status, source_file, sort_key, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(id) DO UPDATE SET
			topic_id = excluded.topic_id,
			title = excluded.title,
			section_path = excluded.section_path,
			statement = excluded.statement,
			constraints = excluded.constraints,
			notes = excluded.notes,
			examples = excluded.examples,
			solutions = excluded.solutions,
			solution_count = excluded.solution_count,
			difficulty = excluded.difficulty,
			status = excluded.status,
			source_file = excluded.source_file,
			sort_key = excluded.sort_key,
			updated_at = CURRENT_TIMESTAMP`)
	if err != nil {
		return fmt.Errorf("prepare problem upsert: %w", err)
	}
	defer statement.Close()

	for _, problem := range problems {
		sections, err := json.Marshal(orEmpty(problem.SectionPath))
		if err != nil {
			return err
		}
		examples, err := json.Marshal(problem.Examples)
		if err != nil {
			return err
		}
		if problem.Examples == nil {
			examples = []byte("[]")
		}
		solutions, err := json.Marshal(problem.Solutions)
		if err != nil {
			return err
		}
		if problem.Solutions == nil {
			solutions = []byte("[]")
		}
		if _, err := statement.ExecContext(ctx,
			problem.ID, problem.TopicID, problem.Title, string(sections), problem.Statement,
			problem.Constraints, problem.Notes, string(examples), string(solutions),
			len(problem.Solutions), problem.Difficulty, problem.Status, problem.SourceFile, problem.SortKey,
		); err != nil {
			return fmt.Errorf("upsert problem %s: %w", problem.ID, err)
		}
	}
	return nil
}

// pruneMissing removes rows whose id is absent from the extracted content, so
// deleting or renaming a file on disk cleans up the database on the next run.
func pruneMissing(ctx context.Context, tx *sql.Tx, table string, keep []string) error {
	rows, err := tx.QueryContext(ctx, fmt.Sprintf("SELECT id FROM %s", table))
	if err != nil {
		return fmt.Errorf("list %s: %w", table, err)
	}
	wanted := make(map[string]struct{}, len(keep))
	for _, id := range keep {
		wanted[id] = struct{}{}
	}
	var stale []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			rows.Close()
			return err
		}
		if _, ok := wanted[id]; !ok {
			stale = append(stale, id)
		}
	}
	rows.Close()

	for _, id := range stale {
		if _, err := tx.ExecContext(ctx, fmt.Sprintf("DELETE FROM %s WHERE id = ?", table), id); err != nil {
			return fmt.Errorf("delete stale %s row %s: %w", table, id, err)
		}
	}
	if len(stale) > 0 {
		log.Printf("  pruned %d stale rows from %s", len(stale), table)
	}
	return nil
}

func topicIDs(topics []fileTopic) []string {
	ids := make([]string, 0, len(topics))
	for _, topic := range topics {
		ids = append(ids, topic.ID)
	}
	return ids
}

func problemIDs(problems []fileProblem) []string {
	ids := make([]string, 0, len(problems))
	for _, problem := range problems {
		ids = append(ids, problem.ID)
	}
	return ids
}

func orEmpty(values []string) []string {
	if values == nil {
		return []string{}
	}
	return values
}
