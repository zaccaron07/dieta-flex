export interface DietData {
  id?: string;
  date: string;
  dateFormatted: Date
  alimentos: DietResult[];
  detalhes: DietAmount[];
}

export interface DietResult {
  name: string;
  portion: boolean;
  fat: number;
  amount: number;
  calorie: number;
  protein: number;
  carbohydrate: number;
}

export interface DietAmount {
  fat: number;
  protein: number;
  calories: number;
  carbohydrate: number;
  totalFat: number;
  totalProtein: number;
  totalCalories: number;
  totalCarbohydrate: number;
}