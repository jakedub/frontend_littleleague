// src/app/models/player.model.ts
import { Team } from './team.model';
import { Division } from './division.model';
import { Evaluation } from './evaluation.model';

export interface Player {
    id: number;
    first_name: string;
    last_name: string;
    street_address: string;
    city: string | null;
    state: string;
    postal_code: string;
    team: Team | null;
    latitude: number | null;
    longitude: number | null;
    district: boolean;
    jersey_size: string | null;
    division: Division | null;
    evaluations: Evaluation[];  // Array of evaluations
}