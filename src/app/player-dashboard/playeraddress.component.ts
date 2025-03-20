import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MarkerService } from '../services/marker.service';
import { PlayerService } from '../services/player.service';
import { ExportService } from '../services/export.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngFor
import { firstValueFrom } from 'rxjs';  // Import firstValueFrom
import { PlayerCombined } from '../models/player-combined.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]  // Add CommonModule to imports
})
export class PlayerAddressComponent implements AfterViewInit {
  private map: any;
  players: PlayerCombined[] = [];  // Add players array
  incompletePlayers: any [] = [];

  constructor(private http: HttpClient, private markerService: MarkerService, 
    private playerService: PlayerService, private exportService: ExportService) {}

  async ngAfterViewInit(): Promise<void>{
    this.initMap();
    this.loadMarkers();
    await this.loadPlayers();
    this.loadPlayersOutsideDistrict();
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

async loadPlayers(): Promise<void> {
  try {
    const playersData: PlayerCombined[] = await firstValueFrom(this.playerService.getPlayers());
    if (Array.isArray(playersData) && playersData.length > 0) {
      this.players = playersData;
      console.log('All players data:', this.players);  // Verify if players data is assigned correctly

      playersData.forEach((player: PlayerCombined) => {
        const district = player.district;  // Access district from PlayerCombined

        if (player.latitude && player.longitude) {
          const lat = player.latitude;
          const lng = player.longitude;

          const playerIcon = L.divIcon({
            className: 'player-icon',
            iconSize: [800, 800],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
            html: `<i class="fas fa-map-marker" style="font-size: 24px; color:${district ? 'gold' : 'green'};"></i>`
          });

          L.marker([lat, lng], { icon: playerIcon })
            .addTo(this.map)
            .bindPopup(`<b>${player.first_name} ${player.last_name}</b><br>Lat: ${lat}, Lng: ${lng}`);
        } else {
          this.incompletePlayers.push(player);  // Add to incompletePlayers if coordinates are missing
        }
      });
    }
  } catch (error) {
    console.error('Error fetching players data:', error);
  }
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
    const outsidePlayers = this.players.filter(player => player.district === false);
    this.handleOutsidePlayers(outsidePlayers);
  }

  handleOutsidePlayers(outsidePlayers: any[]) {
    // Add players to incompletePlayers
    this.incompletePlayers.push(...outsidePlayers);

    // Add markers for players outside the district
    outsidePlayers.forEach((marker: any) => {
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

  populateJson(){
    console.log(this.incompletePlayers);
  }
  
  printIncompletePlayers() {
    console.log('Players without coordinates:', this.incompletePlayers);
  }

  populateCsv() {
    // Get CSV data from the export service, only including players with district === false
    const csvData = this.exportService.exportToCSV(this.incompletePlayers.filter(player => player.district === false));
    
    // Create a Blob from the CSV string
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'incompletePlayers.csv';  // Set default filename for the CSV
    link.click();  // Trigger the download
  }
}