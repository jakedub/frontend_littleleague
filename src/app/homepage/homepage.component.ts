import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MarkerService } from '../marker.service';  // Import the MarkerService
import * as L from 'leaflet';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  coordinates: any[] = [];
  polygons: any[] = [];

  private map: any;

  constructor(private markerService: MarkerService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }
  
  initMap(): void {
    const container = document.getElementById('map');
  
    if (container) {
      // Initialize the Leaflet map
      this.map = L.map(container).setView([environment.mapCenter.lat, environment.mapCenter.lng], 13);
  
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
  
      // Fetch markers from API and add to the map
      this.markerService.getMarkers().subscribe(response => {
        const markers = response.coordinates;
        markers.forEach((marker: any) => {
          L.marker([marker.lat, marker.lng]).addTo(this.map)
            .bindPopup(`<b>Marker</b>`)
            .openPopup();
        });
  
        // Adjust map view to fit all markers
        const latLngs = markers.map((marker: any) => [marker.lat, marker.lng]);
        this.map.fitBounds(latLngs);
      });
    }
  }
}
