import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = 'http://127.0.0.1:8000/api/players/';  // Direct URL to API endpoint

  constructor(private http: HttpClient) {}


  getPlayers(): Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }
}