export interface Diet {
  id?: string;
  date: string;
  dateFormatted?: Date
  foods: DietFood[];
  dietBalance: DietBalance;
}

export interface DietFood {
  id?: string
  name: string;
  portion: boolean;
  fat: number;
  amount: number;
  calorie: number;
  protein: number;
  carbohydrate: number;
}

export interface DietBalance {
  currentFat: number
  currentProtein: number
  currentCalories: number
  currentCarbohydrate: number
  totalDayFat: number
  totalDayProtein: number
  totalDayCalories: number
  totalDayCarbohydrate: number
}