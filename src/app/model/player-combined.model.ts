import { Evaluation } from "./evaluation.model";
import { Player } from "./player.model";

export interface PlayerCombined extends Player {
    evaluation: Evaluation; // Including the evaluation data for the player
  }