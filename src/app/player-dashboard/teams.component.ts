import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { PlayerDivisionService } from '../services/player-division.service';
import { PlayerCombined } from '../models/player-combined.model';

@Component({
  selector: 'app-teams',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.scss']
})
export class TeamsComponent implements OnInit {

  players: PlayerCombined[] = [];
  playersByDivision: { [division: string]: PlayerCombined[] } = {};

  constructor(
    private playerService: PlayerService,
    private playerDivisionService: PlayerDivisionService  // Inject the service
  ) { }

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getPlayers().subscribe(players => {
      this.players = players;
      this.splitPlayersByDivision();  // Call the service to split the players
    });
  }

  splitPlayersByDivision(): void {
    this.playersByDivision = this.playerDivisionService.splitPlayersByDivision(this.players);
    console.log(this.playersByDivision);  // Log grouped players
  }
}