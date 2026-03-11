export type ColorGroup = 'red' | 'orange' | 'yellow' | 'green' | 'purple';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  date: Date;
  colors: ColorGroup[];
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  image: string;
  status: 'available' | 'locked' | 'claimed';
  requiredLevel?: number;
}

export interface UserProfile {
  name: string;
  level: number;
  levelName: string;
  points: number;
  streak: number;
  meals: Meal[];
  badges: Badge[];
}

export type Page = 'dashboard' | 'scan' | 'store' | 'profile';
