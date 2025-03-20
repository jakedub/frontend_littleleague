import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { PlayerDashboardComponent } from './player-dashboard/player-dashboard.component';
import { PlayerAddressComponent } from './player-dashboard/playeraddress.component';
import { TeamsComponent } from './player-dashboard/teams.component';


export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'evaluations', component: EvaluationsComponent },
  { path: 'player-dashboard', component: PlayerDashboardComponent, children: [
    { path: 'player-addresses', component: PlayerAddressComponent },
    { path: 'teams', component: TeamsComponent }
  ]
  }
];