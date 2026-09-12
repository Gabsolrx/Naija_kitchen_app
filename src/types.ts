export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Recipe {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: number; // in minutes
  cookingTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  difficulty: Difficulty;
  tags: string[];
  searchKeywords: string[];
  timerDuration: number; // in seconds
}

export interface TimetableMeal {
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
}

export interface Timetable {
  [day: number]: TimetableMeal;
}

export interface AboutContent {
  title: string;
  description: string;
  developerInfo: string;
  version: string;
  contactEmail: string;
}
