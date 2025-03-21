import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../services/evaluation.service';
import { PlayerService } from '../services/player.service';
import { PlayerDivisionService } from '../services/player-division.service';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./evaluations.component.scss']
})
export class EvaluationsComponent implements OnInit {
  evaluationForm!: FormGroup;
  evaluations$: Observable<any[]> = new Observable();
  players$: Observable<any[]> = new Observable();
  evaluations: any[] = [];
  flattenedPlayers: any[] = [];
  playersByDivision: { [division: string]: any[] } = {}; 

  displayedColumns: string[] = [
    'division',
    'rank',
    'name',
    'hitting_power',
    'hitting_contact',
    'hitting_form',
    'fielding_form',
    'fielding_glove',
    'fielding_hustle',
    'throwing_form',
    'throwing_accuracy',
    'throwing_speed',
    'total_sum',
    'pitching_speed',
    'pitching_accuracy'
  ];

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private playerService: PlayerService,
    private playerDivisionService: PlayerDivisionService
  ) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.fetchEvaluations();
    this.getDivisions();
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
  }

  loadPlayers(): void {
    this.players$ = this.playerService.getPlayers();
    this.players$.subscribe(players => {
      this.flattenedPlayers = players;
    });
  }

  fetchEvaluations(): void {
    combineLatest([this.players$, this.evaluationService.getEvaluations()])
      .subscribe(([players, evaluations]) => {
        this.evaluations = evaluations;

        players.forEach(player => {
          const evaluation = this.evaluations.find(evaluation =>
            evaluation.player.id === player.id || 
            (evaluation.player.first_name === player.first_name && evaluation.player.last_name === player.last_name)
          );

          player.evaluation = evaluation || {
            hitting_power: 'N/A',
            hitting_contact: 'N/A',
            hitting_form: 'N/A',
            fielding_form: 'N/A',
            fielding_glove: 'N/A',
            fielding_hustle: 'N/A',
            throwing_form: 'N/A',
            throwing_accuracy: 'N/A',
            throwing_speed: 'N/A',
            pitching_speed: 'N/A',
            pitching_accuracy: 'N/A'
          };
        });
        this.splitAndLogPlayersByDivision(players);
      });
  }
  getDivisions(): string[] {
    // Log the divisions for debugging purposes
    console.log('Divisions:', Object.keys(this.playersByDivision));
    return Object.keys(this.playersByDivision);
  }

  splitAndLogPlayersByDivision(players: any[]): void {
    this.playersByDivision = this.playerDivisionService.splitPlayersByDivision(players);

    // Log the players grouped by division with their evaluations
    Object.keys(this.playersByDivision).forEach(division => {
      console.log(`Division: ${division}`);
      this.playersByDivision[division].forEach((player: { first_name: any; last_name: any; evaluation: any; }) => {
        console.log(`Player: ${player.first_name} ${player.last_name}, Evaluation: `, player.evaluation);
      });
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

  calculateTotalHitting(row: any): number {
    return row.hitting_power + row.hitting_contact + row.hitting_form;
  }

  calculateTotalFielding(row: any): number {
    return row.fielding_form + row.fielding_glove + row.fielding_hustle;
  }

  calculateTotalThrowing(row: any): number {
    return row.throwing_form + row.throwing_accuracy + row.throwing_speed;
  }

  calculateTotalPitching(row: any): number {
    return row.pitching_accuracy + row.pitching_speed;
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