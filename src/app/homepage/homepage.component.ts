// homepage.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var H: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit {

  private platform: any;
  private map: any;
  private defaultLayers: any;

  constructor() {}

  ngOnInit(): void {
    this.platform = new H.service.Platform({
      apikey: 'YOUR_API_KEY'
    });

    this.defaultLayers = this.platform.createDefaultLayers();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const container = document.getElementById('map');

    this.map = new H.Map(container, this.defaultLayers.vector.normal.map, {
      center: { lat: 51.505, lng: -0.09 },
      zoom: 13
    });

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

    const ui = H.ui.UI.createDefault(this.map, this.defaultLayers);
  }
}