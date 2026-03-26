// User types
export interface User {
  id: string;
  nickname: string;
  email: string;
  user_level: 'beginner' | 'intermediate' | 'advanced';
  plan: 'free' | 'pro';
  plan_expires_at?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserPreferences {
  default_palette_id?: string;
  default_board_size: 'small' | 'standard' | 'large';
  unit: 'cm' | 'inch';
  show_grid: boolean;
}

// Work types
export interface Work {
  id: string;
  user_id: string;
  name: string;
  status: 'draft' | 'in_progress' | 'completed';
  source_type: 'import' | 'template';
  template_id?: string;
  grid_width: number;
  grid_height: number;
  grid_data: GridData;
  palette_id?: string;
  total_beads: number;
  color_count: number;
  board_count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  color_summary: ColorSummary[];
  scheme_config: Record<string, any>;
  follow_state: FollowState;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface GridData {
  format: '2d_array' | 'rle';
  data: string[][];
}

export interface ColorSummary {
  color_id: string;
  color_name: string;
  hex: string;
  count: number;
}

export interface FollowState {
  mode?: 'by_color' | 'by_region' | 'by_row';
  current_step?: number;
  total_steps?: number;
  completed_steps?: number[];
  progress_percent?: number;
  last_updated?: string;
}

// Scheme types
export interface Scheme {
  type: 'simple' | 'standard' | 'fine';
  label: string;
  tag: string;
  grid_width: number;
  grid_height: number;
  color_count: number;
  total_beads: number;
  board_count: number;
  estimated_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  preview_url: string;
  grid_data: GridData;
  color_summary: ColorSummary[];
}

export interface ConvertResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  schemes?: Scheme[];
  suitability_score?: number;
  suitability_hint?: string;
}

// Palette types
export interface ColorInfo {
  id: string;
  name: string;
  name_en: string;
  hex: string;
  rgb: [number, number, number];
  category: string;
  available: boolean;
}

export interface Palette {
  id: string;
  brand: string;
  name: string;
  version?: string;
  colors: ColorInfo[];
  color_count: number;
  is_default: boolean;
}

// Template types
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  grid_width: number;
  grid_height: number;
  palette_id?: string;
  total_beads: number;
  color_count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  preview_url?: string;
  is_featured: boolean;
  is_starter: boolean;
  use_count: number;
  favorite_count: number;
}

// API Response types
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
