// src/app/models/team.model.ts
import { Division } from './division.model';

export interface Team {
    id: number;
    name: string;
    division: Division;  // Reference to the Division model
  }