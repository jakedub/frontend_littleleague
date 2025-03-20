// src/app/models/player-team-division.model.ts
import { Player } from './player.model';
import { Team } from './team.model';
import { Division } from './division.model';
import { Evaluation } from './evaluation.model';

export interface PlayerCombined extends Player {
  team: Team;
  division: Division;
  evaluation: Evaluation;
}