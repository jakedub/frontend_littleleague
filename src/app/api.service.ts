import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api/';  // Base URL for your API

  constructor(private http: HttpClient) {}

  // Example for getting data from an API endpoint
  getExampleData(): Observable<any> {
    return this.http.get(`${this.apiUrl}example/`).pipe(
      catchError(this.handleError)
    );
  }

  // Example for getting teams data
  getTeams(): Observable<any> {
    return this.http.get(`${this.apiUrl}teams/`).pipe(
      catchError(this.handleError)
    );
  }

  // Example for posting data to an API endpoint
  postExampleData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}example/`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    // You can display an error message or log it here
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
