import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';  // Import Leaflet library
import { environment } from '../../environments/environment';  // Import environment variables

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true
})
export class HomepageComponent implements AfterViewInit {
  private map: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const container = document.getElementById('map');  // Get the element with id 'map'

    if (container) {
      // Initialize the Leaflet map and set the initial position from environment variables
      this.map = L.map(container).setView([environment.mapCenter.lat, environment.mapCenter.lng], 13);

      // Add tile layer (OpenStreetMap tiles)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Log the initial coordinates (center of the map)
      console.log('Map initialized at coordinates:', environment.mapCenter);

      // Log coordinates when the map is clicked
      this.map.on('click', (e: any) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        console.log('Clicked coordinates:', { lat, lng });
      });
    } else {
      console.error('Map container not found');
    }
  }
}