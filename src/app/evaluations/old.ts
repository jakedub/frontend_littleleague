import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../services/evaluation.service';
import { PlayerService } from '../services/player.service';
import { PlayerDivisionService } from '../services/player-division.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import Tablesort from 'tablesort';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./evaluations.component.scss']
})
export class EvaluationsComponent implements OnInit, AfterViewChecked {
  evaluationForm!: FormGroup;
  players$: Observable<PlayerCombined[]> = new Observable();
  evaluations$: Observable<any[]> = new Observable();
  playersByDivision: { [division: string]: PlayerCombined[] } = {};
  divisions: string[] = [];
  evaluations: any[] = [];
  flattenedPlayers: any[] = [];
  tableInitialized = false;

  displayedColumns: string[] = [
    'division', 'rank', 'name', 'hitting_power', 'hitting_contact', 
    'hitting_form', 'fielding_form', 'fielding_glove', 'fielding_hustle', 
    'throwing_form', 'throwing_accuracy', 'throwing_speed', 'total_sum', 
    'pitching_speed', 'pitching_accuracy'
  ];

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private playerService: PlayerService,
    private playerDivisionService: PlayerDivisionService
  ) {}

  ngOnInit(): void {
    this.fetchEvaluations();
    this.evaluationForm = this.fb.group({
      season_year: ['', Validators.required],
      evaluation_type: ['', Validators.required],
      hitting_power: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      hitting_contact: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      hitting_form: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      fielding_form: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      fielding_glove: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      fielding_hustle: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      throwing_form: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      throwing_accuracy: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      throwing_speed: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      pitching_speed: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      pitching_accuracy: ['', [Validators.min(1), Validators.max(5)]]
    });

    this.loadPlayers();
  }

  ngAfterViewChecked(): void {
    if (!this.tableInitialized) {
      const table = document.getElementById('division-table');
      if (table) {
        new Tablesort(table);
        this.tableInitialized = true; // Ensure Tablesort is only applied once
      }
    }
  }
  fetchEvaluations(): void {
    this.evaluations$ = this.evaluationService.getEvaluations();
    this.evaluations$.subscribe((evaluations) => {
      this.evaluations = evaluations;
      console.log('Evaluations:', this.evaluations); // Log evaluations data for inspection
  
      this.players$.subscribe(players => {
        console.log('Players before processing:', players); // Log players data to inspect player.id
  
        players.forEach(player => {
          console.log(`Processing Player ID: ${player.id} - Name: ${player.first_name} ${player.last_name}`);
  
          // Ensure that player has evaluations and find the most relevant evaluation
          const playerEvaluations = evaluations.filter(evaluation => evaluation.player_id === player.id);
  
          if (playerEvaluations.length > 0) {
            // If there are multiple evaluations, select the most recent one based on created_at or season_year
            const latestEvaluation = playerEvaluations.sort((a, b) => {
              // Sort evaluations by season_year (or created_at) to get the most recent evaluation
              return b.season_year - a.season_year;
            })[0];
  
            // Assign the selected evaluation to the player
            player.evaluation = { ...latestEvaluation };
          } else {
            // If no evaluation found, assign default values
            console.log(`No evaluation found for ${player.first_name} ${player.last_name}, assigning default values.`);
            player.evaluation = {
              id: 0,
              player_id: player.id,
              season_year: 0,
              evaluation_type: 'beginning',  // Default evaluation type
              created_at: new Date().toISOString(),
              hitting_power: 0,
              hitting_contact: 0,
              hitting_form: 0,
              fielding_form: 0,
              fielding_glove: 0,
              fielding_hustle: 0,
              throwing_form: 0,
              throwing_accuracy: 0,
              throwing_speed: 0,
              pitching_speed: 0,
              pitching_accuracy: 0
            };
          }
        });
  
        // Ensure proper grouping of players into divisions
        this.playersByDivision = this.playerDivisionService.splitPlayersByDivision(players);
        this.divisions = Object.keys(this.playersByDivision);
  
        console.log('Players with Evaluations after processing:', this.playersByDivision); // Log the final players with their evaluations
      });
    });
  }
  loadPlayers(): void {
    this.players$ = this.playerService.getPlayers();
    console.log('load players', this.players$)
    this.players$.subscribe(players => {
      this.playersByDivision = this.playerDivisionService.splitPlayersByDivision(players);
      this.divisions = Object.keys(this.playersByDivision); 
    });
  }

  applyFilters(event?: Event): void {
    const filterValue = event ? (event.target as HTMLInputElement).value.toLowerCase() : '';
    this.flattenedPlayers = this.flattenedPlayers.filter(player =>
      player.first_name.toLowerCase().includes(filterValue) || 
      player.last_name.toLowerCase().includes(filterValue)
    );
  }

  calculateRankings(): void {
    this.evaluations.sort((a, b) => this.calculateTotalSum(b) - this.calculateTotalSum(a));

    let rank = 1;
    this.evaluations.forEach((evaluation, index) => {
      if (index > 0 && this.calculateTotalSum(this.evaluations[index - 1]) === this.calculateTotalSum(evaluation)) {
        evaluation.rank = this.evaluations[index - 1].rank;
      } else {
        evaluation.rank = rank;
      }
      rank++;
    });

    this.flattenedPlayers = this.evaluations;
  }

  calculateTotalSum(row: any): number {
    return row.hitting_power + row.hitting_contact + row.hitting_form +
           row.fielding_form + row.fielding_glove + row.fielding_hustle +
           row.throwing_form + row.throwing_accuracy + row.throwing_speed;
  }

  onSubmit(): void {
    if (this.evaluationForm.valid) {
      const evaluationData = this.evaluationForm.value;
      this.evaluationService.saveEvaluation(evaluationData).subscribe(
        (response: any) => {
          console.log('Evaluation created successfully', response);
        },
        (error: any) => {
          console.error('Error creating evaluation', error);
        }
      );
    }
  }
}