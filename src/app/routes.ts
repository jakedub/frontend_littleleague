import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'evaluations', component: EvaluationsComponent},
  { path: 'player-dashboard', component: DashboardComponent}
];