import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, FooterComponent, MenuComponent],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
    private map: any;

    ngOnInit(): void {
        this.initMap();
    }

    private initMap(): void {
        this.map = L.map('map', {
            center: [-14.235, -51.9253], // Centro do Brasil
            zoom: 4,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            // Omitindo o parâmetro attribution
        }).addTo(this.map);


        // Adicionando marcadores
        L.marker([-23.5505, -46.6333]).addTo(this.map).bindPopup('São Paulo');
        L.marker([-22.9068, -43.1729]).addTo(this.map).bindPopup('Rio de Janeiro');
        L.marker([-15.7942, -47.8822]).addTo(this.map).bindPopup('Brasília');
    }
}