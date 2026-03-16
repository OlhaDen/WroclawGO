import { Component, OnInit } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { AttractionService } from './services/attraction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  map!: maplibregl.Map;

  constructor(private attractionService: AttractionService) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [17.0385, 51.1079],
      zoom: 13
    });

    this.map.on('load', () => {
      this.loadAttractions();
    });
  }

  loadAttractions() {
    this.attractionService.getAttractions().subscribe({
      next: (data) => {
        console.log('Dane z API:', data); // Zobacz to w konsoli!

        data.features.forEach(feature => {
          // 1. Sprawdzenie współrzędnych
          const coords = feature.geometry?.coordinates;
          if (!coords || coords[0] == null || coords[1] == null) {
            console.warn('Pominięto punkt bez koordynatów:', feature);
            return;
          }

          // 2. Pobranie właściwości (zwróć uwagę na nazwy!)
          const name = feature.properties?.name || 'Brak nazwy';
          const description = feature.properties?.description || 'Brak opisu';

          // 3. Tworzenie markera i popupu
          const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div style="color: black;">
                <h3 style="margin: 0;">${name}</h3>
                <p style="margin: 5px 0 0;">${description}</p>
              </div>
            `);

          new maplibregl.Marker({ color: '#FF0000' })
            .setLngLat([coords[0], coords[1]])
            .setPopup(popup)
            .addTo(this.map);
        });
      },
      error: (err) => console.error('Błąd API:', err)
    });
  }
}