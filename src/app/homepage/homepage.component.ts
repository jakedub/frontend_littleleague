import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MarkerService } from '../services/marker.service';
import { PlayerService } from '../services/player.service';
import { ExportService } from '../services/export.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngFor
import { firstValueFrom } from 'rxjs';  // Import firstValueFrom
import { IncomeComponent } from '../income/income.component';
import { ExpenseComponent } from '../expense/expense.component';
import { FundraisingComponent } from "../fundraising/fundraising.component";
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Router, RouterModule } from '@angular/router';
import { ChartComponent, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexStroke, ApexTitleSubtitle, ApexGrid, ApexLegend, ApexTooltip, ApexResponsive, ApexMarkers, ApexPlotOptions, ApexFill, ApexTheme } from "ng-apexcharts";
import { FAKE_DATA, FRUITS, NAMES, UserData } from '../shared/mock-data';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    NgScrollbarModule,
    RouterModule,
  ]
})
export class HomepageComponent implements AfterViewInit {
  isMenuOpen = false; // Track whether the menu is open or closed
  showPlayerDashboard = false; // Track Player Dashboard section visibility
  showEvaluations = false; // Track Evaluations section visibility
  private map: any;
  players: any[] = [];  // Add players array
  incompletePlayers: any [] = [];
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];

  constructor(private http: HttpClient, private markerService: MarkerService, 
    private playerService: PlayerService, private exportService: ExportService,
    // dataSource = new MatTableDataSource(FAKE_DATA)
  ) {}
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
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
      const playersData: any = await firstValueFrom(this.playerService.getPlayers());  // Use firstValueFrom for async data fetching
      if (Array.isArray(playersData) && playersData.length > 0) {
        // Assigning the players data to the players array
        this.players = playersData;
        console.log('All players data:', this.players);  // Verify if players data is assigned correctly
  
        playersData.forEach((marker: any) => {
          // Log the full player data to inspect the response
  
          // Explicitly check for district value
          const district = marker.district;
  
          // Log the player information along with district (explicitly showing district value)
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
          } else {
            // Add to incompletePlayers if latitude or longitude is nil
            this.incompletePlayers.push(marker);
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

    // applyFilter(event: Event) {
    //   const filterValue = (event.target as HTMLInputElement).value;
    //   this.dataSource.filter = filterValue.trim().toLowerCase();
  
    //   if (this.dataSource.paginator) {
    //     this.dataSource.paginator.firstPage();
    //   }
    }
    // function createNewUser(id: number): UserData {
    //   const name =
    //     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    //     ' ' +
    //     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    //     '.';
    
    //   return {
    //     id: id,  // Keep id as a number instead of converting to a string
    //     name: name,
    //     progress: Math.round(Math.random() * 100).toString(),
    //     fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
    //   };
  
    // showFiller = false;
  
    // ngAfterViewInit() {
    //   if (this.paginator) {
    //     this.dataSource.paginator = this.paginator;
    //   }
    //   if (this.sort) {
    //     this.dataSource.sort = this.sort;
    //   }
    // }

