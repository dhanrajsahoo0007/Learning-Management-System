package models

import "time"

// DSATopic represents a Data Structures & Algorithms topic
type DSATopic struct {
	ID            string     `json:"id" db:"id"`
	Title         string     `json:"title" db:"title"`
	Category      string     `json:"category" db:"category"`
	Description   string     `json:"description" db:"description"`
	Difficulty    string     `json:"difficulty" db:"difficulty"` // Easy, Medium, Hard
	Progress      int        `json:"progress" db:"progress"`
	Icon          string     `json:"icon" db:"icon"`
	Color         string     `json:"color" db:"color"`
	FolderPath    string     `json:"folderPath" db:"folder_path"`
	ProblemCount  int        `json:"problemCount" db:"problem_count"`
	SolvedCount   int        `json:"solvedCount" db:"solved_count"`
	Subcomponents []string   `json:"subcomponents,omitempty"` // Stored as JSON in DB
	Content       DSAContent `json:"content"`                 // Stored as JSON in DB
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at" db:"updated_at"`
}

// DSAContent represents the detailed content of a DSA topic
type DSAContent struct {
	Explanation   string        `json:"explanation"`
	Examples      []DSAExample  `json:"examples"`
	CodeTemplates CodeTemplates `json:"codeTemplates"`
	TestCases     []TestCase    `json:"testCases"`
	Hints         []string      `json:"hints"`
	Solution      string        `json:"solution"`
}

// DSAExample represents an example for a DSA problem
type DSAExample struct {
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation"`
}

// CodeTemplates represents code templates in different languages
type CodeTemplates struct {
	JavaScript string `json:"javascript"`
	Python     string `json:"python"`
	Java       string `json:"java"`
	CPP        string `json:"cpp"`
}

// TestCase represents a test case for a DSA problem
type TestCase struct {
	Input          string `json:"input"`
	ExpectedOutput string `json:"expectedOutput"`
}

// DSACategory represents a DSA category
type DSACategory struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

// Problem status values. A problem is pending when its source file exists in
// the curriculum but does not contain a solution yet.
const (
	ProblemStatusSolved  = "solved"
	ProblemStatusPending = "pending"
)

// Complexity holds the time and space analysis for one solution variant.
type Complexity struct {
	Time  string `json:"time,omitempty"`
	Space string `json:"space,omitempty"`
}

// DSASolution is one implementation of a problem. A single file often contains
// several named variants, for example a hash map approach and a sorting one.
type DSASolution struct {
	Language   string      `json:"language"`
	Code       string      `json:"code"`
	Name       string      `json:"name,omitempty"`
	Complexity *Complexity `json:"complexity,omitempty"`
}

// DSAProblem is a single problem from the content tree.
type DSAProblem struct {
	ID          string        `json:"id" db:"id"`
	TopicID     string        `json:"topicId" db:"topic_id"`
	Title       string        `json:"title" db:"title"`
	SectionPath []string      `json:"sectionPath"`
	Statement   string        `json:"statement"`
	Constraints string        `json:"constraints,omitempty"`
	Notes       string        `json:"notes,omitempty"`
	Examples    []DSAExample  `json:"examples"`
	Solutions   []DSASolution `json:"solutions"`
	Difficulty  string        `json:"difficulty,omitempty"`
	Status      string        `json:"status"`
	SourceFile  string        `json:"sourceFile"`
	SortKey     string        `json:"sortKey"`
}

// DSAProblemSummary is the list payload. It deliberately omits statements and
// solution bodies, which would otherwise make a topic like Graphs, with 149
// problems, an enormous response.
type DSAProblemSummary struct {
	ID            string   `json:"id"`
	TopicID       string   `json:"topicId"`
	Title         string   `json:"title"`
	SectionPath   []string `json:"sectionPath"`
	Difficulty    string   `json:"difficulty,omitempty"`
	Status        string   `json:"status"`
	SortKey       string   `json:"sortKey"`
	HasSolution   bool     `json:"hasSolution"`
	HasStatement  bool     `json:"hasStatement"`
	SolutionCount int      `json:"solutionCount"`
}
