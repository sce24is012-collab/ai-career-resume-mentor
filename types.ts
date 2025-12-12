export interface SkillCategories {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface ImprovementSuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

export interface CareerPath {
  role: string;
  matchReason: string;
  roadmap: string[];
}

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  grammarIssues: string[];
  skills: SkillCategories;
  improvements: ImprovementSuggestion[];
  careerPaths: CareerPath[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
