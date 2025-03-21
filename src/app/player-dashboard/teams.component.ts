import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { PlayerDivisionService } from '../services/player-division.service';


@Component({
  selector: 'app-teams',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css']
})
export class TeamsComponent implements OnInit {


  constructor(
    private playerService: PlayerService,
    private playerDivisionService: PlayerDivisionService  // Inject the service
  ) { }

  ngOnInit(): void {

  }

}