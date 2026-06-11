export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  createdAt: string;
}

export interface Activity {
  time: string;
  activity: string;
  tips: string;
}

export interface Itinerary {
  day: number;
  activities: Activity[];
}

export interface BudgetItem {
  category: string;
  cost: number;
  percentage: number;
  notes: string;
}

export interface ConcertKitItem {
  item: string;
  urgency: 'Wajib' | 'Opsional';
}

export interface DresscodeRecommendations {
  concept: string;
  items: string[];
  color_palette: string[];
}

export interface ConcertPlan {
  status: "success";
  concert_summary: {
    target_location: string;
    estimated_days: number;
    total_budget_needed: string;
  };
  budget_allocation: BudgetItem[];
  itinerary: Itinerary[];
  dresscode_recommendations: DresscodeRecommendations;
  concert_kit_checklist: ConcertKitItem[];
}

export interface SavedPlan {
  id: string;
  userId: string;
  city: string;
  budget: number;
  duration: number;
  planData: ConcertPlan;
  createdAt: string;
}
