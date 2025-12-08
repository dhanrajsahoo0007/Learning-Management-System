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
