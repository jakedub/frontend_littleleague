import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';  // Import Leaflet library
import { environment } from '../../environments/environment';  // Import environment variables
import { HttpClient } from '@angular/common/http';
import { MarkerService } from '../marker.service';  // Import MarkerService
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true
})
export class HomepageComponent implements AfterViewInit {
  private map: any;

  constructor(private http: HttpClient, private markerService: MarkerService, private playerService: PlayerService) {
    console.log('HttpClient Initialized');
  }


  ngAfterViewInit(): void {
    this.initMap();;
    this.loadMarkers();  // Call the marker service to load markers
    this.loadPlayers();
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
  loadPlayers(): void{
    this.playerService.getPlayers().subscribe((playersData: any) => {
      console.log('Players Data:', playersData);
    })
  }

  loadMarkers(): void {
    // Fetch markers from the MarkerService and add them to the map
    this.markerService.getMarkers().subscribe((markersData: any) => {
      console.log('Fetched markers data:', markersData);
  
      if (this.map) {
        // Check if 'coordinates' exists and is an array for markers
        if (Array.isArray(markersData.coordinates)) {
          console.log('Marker coordinates found:', markersData.coordinates);
  
          markersData.coordinates.forEach((marker: any) => {
            const lat = marker.lat;
            const lng = marker.lng;
  
            // Create a marker and add it to the map
            L.marker([lat, lng]).addTo(this.map)
              .bindPopup(`<b>Marker</b><br>Lat: ${lat}, Lng: ${lng}`);
          });
        } else {
          console.error('Expected an array for coordinates, but received:', markersData.coordinates);
        }
  
        // Check if 'polygons' exists and is an array
        if (Array.isArray(markersData.polygons)) {
          console.log('Polygons found:', markersData.polygons);
  
          markersData.polygons.forEach((polygonCoords: any) => {
            console.log('Polygon coordinates:', polygonCoords);
  
            // Extract valid lat/lng pairs from the coordinate data
            const validCoords = polygonCoords.map((coord: any) => {
              // Ensure we are only extracting the first two elements (lat and lng)
              if (Array.isArray(coord) && coord.length >= 2) {
                return [coord[1], coord[0]];  // [lat, lng] assuming the data is [lng, lat, other]
              }
              return null;  // Return null if the coordinate is not in the expected format
            }).filter((coord: any) => coord !== null);  // Remove invalid coordinates
  
            console.log('Valid polygon coordinates:', validCoords);
  
            if (validCoords.length > 0) {
              // Create the polygon with valid coordinates
              const polygon = L.polygon(validCoords, {
                color: 'blue',       // Change color to red
                weight: 3,
                fillOpacity: 0.6    // Increase fillOpacity for better visibility
              }).addTo(this.map);
  
              // Optional: Bind a popup to the polygon
              polygon.bindPopup('<b>Polygon</b><br>Contains the provided coordinates.');
  
              // Log the polygon bounds and adjust the map view
              console.log('Polygon bounds:', polygon.getBounds());
              const bounds = polygon.getBounds();
              this.map.fitBounds(bounds);  // Adjust map view to fit polygon bounds
            } else {
              console.error('No valid coordinates found for polygon:', polygonCoords);
            }
          });
        } else {
          console.error('Expected an array for polygons, but received:', markersData.polygons);
        }
      }
    });
  }
}