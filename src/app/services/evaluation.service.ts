import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = 'http://127.0.0.1:8000/api/evaluations/';  // Direct URL to API endpoint

  constructor(private http: HttpClient) {}


  getEvaluations(): Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }

  saveEvaluation(evaluationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/evaluations`, evaluationData);
  }
}