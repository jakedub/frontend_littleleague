import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private apiUrl = `${environment.apiBaseUrl}/api/kml-coordinates/`;  // Ensure correct URL

  constructor(private http: HttpClient) {}

  getMarkers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}