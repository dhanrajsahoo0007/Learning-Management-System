package models

import "time"

// SystemDesignTopic represents a System Design or AI System Design topic
type SystemDesignTopic struct {
	ID               string              `json:"id" db:"id"`
	Title            string              `json:"title" db:"title"`
	Description      string              `json:"description" db:"description"`
	Difficulty       string              `json:"difficulty" db:"difficulty"`
	Progress         int                 `json:"progress" db:"progress"`
	Icon             string              `json:"icon" db:"icon"`
	Color            string              `json:"color" db:"color"`
	Content          SystemDesignContent `json:"content"`
	IsAITopic        bool                `json:"isAITopic" db:"is_ai_topic"`
	Section          string              `json:"section,omitempty"`
	Track            string              `json:"track,omitempty"`
	Prerequisites    []string            `json:"prerequisites,omitempty"`
	EstimatedMinutes int                 `json:"estimatedMinutes,omitempty"`
	Order            int                 `json:"order,omitempty"`
	CreatedAt        time.Time           `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time           `json:"updated_at" db:"updated_at"`
}

type RequirementItem struct {
	Title  string `json:"title"`
	Detail string `json:"detail"`
}

type EstimateItem struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Note  string `json:"note,omitempty"`
}

type APIEndpoint struct {
	Method      string `json:"method"`
	Path        string `json:"path"`
	Description string `json:"description"`
}

type DataModelTable struct {
	Name    string   `json:"name"`
	Columns []string `json:"columns"`
	Notes   string   `json:"notes,omitempty"`
}

type DeepDive struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

type ScalingStage struct {
	Scale string `json:"scale"`
	Focus string `json:"focus"`
}

type SystemDesignContent struct {
	Overview                  string             `json:"overview"`
	WhyItExists               string             `json:"whyItExists,omitempty"`
	WhenToUse                 []string           `json:"whenToUse,omitempty"`
	FunctionalRequirements    []RequirementItem  `json:"functionalRequirements,omitempty"`
	NonFunctionalRequirements []RequirementItem  `json:"nonFunctionalRequirements,omitempty"`
	Estimates                 []EstimateItem     `json:"estimates,omitempty"`
	Concepts                  []string           `json:"concepts"`
	Walkthrough               []SystemDesignStep `json:"walkthrough,omitempty"`
	Steps                     []SystemDesignStep `json:"steps"`
	APIs                      []APIEndpoint      `json:"apis,omitempty"`
	DataModel                 []DataModelTable   `json:"dataModel,omitempty"`
	Architecture              string             `json:"architecture,omitempty"`
	Diagram                   string             `json:"diagram,omitempty"`
	DeepDives                 []DeepDive         `json:"deepDives,omitempty"`
	Tradeoffs                 []string           `json:"tradeoffs,omitempty"`
	Bottlenecks               []string           `json:"bottlenecks,omitempty"`
	ScalingPath               []ScalingStage     `json:"scalingPath,omitempty"`
	InterviewScript           []string           `json:"interviewScript,omitempty"`
	CommonMistakes            []string           `json:"commonMistakes,omitempty"`
	RelatedTopics             []string           `json:"relatedTopics,omitempty"`
	Examples                  []string           `json:"examples"`
	PracticePrompt            string             `json:"practicePrompt,omitempty"`
}

type SystemDesignStep struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Diagram     string `json:"diagram,omitempty"`
}
