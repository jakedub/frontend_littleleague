// src/app/models/evaluation.model.ts
export interface Evaluation {
  id: number;
  player_id: number;
  season_year: number;
  evaluation_type: 'beginning' | 'end'; // Can either be 'beginning' or 'end' of year
  hitting_power: number | null;
  hitting_contact: number | null;
  hitting_form: number | null;
  fielding_form: number | null;
  fielding_glove: number | null;
  fielding_hustle: number | null;
  throwing_form: number | null;
  throwing_accuracy: number | null;
  throwing_speed: number | null;
  pitching_speed: number | null;
  pitching_accuracy: number | null;
  created_at: string;  // Assuming the created_at is a string in ISO format
}