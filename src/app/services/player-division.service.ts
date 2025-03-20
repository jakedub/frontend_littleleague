import { Injectable } from '@angular/core';
import { PlayerCombined } from '../models/player-combined.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerDivisionService {

  constructor() { }

  // Split players by division
  splitPlayersByDivision(players: PlayerCombined[]): { [division: string]: PlayerCombined[] } {
    const divisionGroups: { [division: string]: PlayerCombined[] } = {};

    // Loop through the players and group them by division
    players.forEach(player => {
      const divisionName = player.division?.name || 'Unassigned';  // Default to 'Unassigned' if no division is provided
      if (!divisionGroups[divisionName]) {
        divisionGroups[divisionName] = [];
      }
      divisionGroups[divisionName].push(player);
    });

    return divisionGroups;
  }
}