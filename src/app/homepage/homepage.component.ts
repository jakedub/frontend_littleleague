import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MarkerService } from '../marker.service';
import { PlayerService } from '../player.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngFor

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule]  // Add CommonModule to imports
})
export class HomepageComponent implements AfterViewInit {
  private map: any;
  players: any[] = [];  // Add players array

  constructor(private http: HttpClient, private markerService: MarkerService, private playerService: PlayerService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadMarkers();
    this.loadPlayers();
  }

  initMap(): void {
    const container = document.getElementById('map');

    if (container) {
      this.map = L.map(container).setView([environment.mapCenter.lat, environment.mapCenter.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
      });
    } else {
      console.error('Map container not found');
    }
  }

  loadPlayers(): void {
    this.playerService.getPlayers().subscribe((playersData: any) => {
      if (Array.isArray(playersData) && playersData.length > 0) {
        // Assigning the players data to the players array
        this.players = playersData;
        console.log('All players data:', this.players);  // Verify if players data is assigned correctly
  
        playersData.forEach((marker: any) => {
          // Log the full player data to inspect the response
          console.log('Full Player Data:', marker);
  
          // Explicitly check for district value
          const district = marker.district;
  
          // Log the player information along with district (explicitly showing district value)
          console.log(`Player: ${marker.first_name} ${marker.last_name}, Lat: ${marker.latitude}, Lng: ${marker.longitude}, District: ${district !== undefined ? district : 'Not Defined'}`);
  
          if (marker.latitude && marker.longitude) {
            const lat = marker.latitude;
            const lng = marker.longitude;
  
            const playerIcon = L.divIcon({
              className: 'player-icon',
              iconSize: [800, 800],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
              html: '<i class="fas fa-map-marker" style="font-size: 24px; color:' + (district ? 'gold' : 'green') + ';"></i>'
            });
  
            L.marker([lat, lng], { icon: playerIcon })
              .addTo(this.map)
              .bindPopup(`<b>${marker.first_name} ${marker.last_name}</b><br>Lat: ${lat}, Lng: ${lng}`);
          }
        });
      }
    }, (error) => {
      console.error('Error fetching players data:', error);
    });
  }
  loadMarkers(): void {
    this.markerService.getMarkers().subscribe((markersData: any) => {
      if (this.map) {
        if (Array.isArray(markersData.coordinates)) {
          markersData.coordinates.forEach((marker: any) => {
            const lat = marker.lat;
            const lng = marker.lng;

            L.marker([lat, lng]).addTo(this.map)
              .bindPopup(`<b>Marker</b><br>Lat: ${lat}, Lng: ${lng}`);
          });
        }

        if (Array.isArray(markersData.polygons)) {
          markersData.polygons.forEach((polygonCoords: any) => {
            const validCoords = polygonCoords.map((coord: any) => {
              if (Array.isArray(coord) && coord.length >= 2) {
                return [coord[1], coord[0]];
              }
              return null;
            }).filter((coord: any) => coord !== null);

            if (validCoords.length > 0) {
              const polygon = L.polygon(validCoords, {
                color: 'blue',
                weight: 3,
                fillOpacity: 0.6
              }).addTo(this.map);

              polygon.bindPopup('<b>Polygon</b><br>Contains the provided coordinates.');

              const bounds = polygon.getBounds();
              this.map.fitBounds(bounds);
            }
          });
        }
      }
    });
  }

  loadPlayersOutsideDistrict() {
    this.players = this.players.filter(player => !player.district);

    // Add markers for players outside the district
    this.players.forEach((marker: any) => {
      if (marker.latitude && marker.longitude) {
        const lat = marker.latitude;
        const lng = marker.longitude;

        const playerIcon = L.divIcon({
          className: 'player-icon',
          iconSize: [800, 800],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          html: '<i class="fas fa-map-marker" style="font-size: 24px; color:green;"></i>'  // Color green for players outside district
        });

        L.marker([lat, lng], { icon: playerIcon })
          .addTo(this.map)
          .bindPopup(`<b>${marker.first_name} ${marker.last_name}</b><br>Lat: ${lat}, Lng: ${lng}`);
      }
    });

    this.loadMarkers();
  }
}