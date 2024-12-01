import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: 'assets/images/marker-icon.png', // Caminho relativo aos seus assets
    shadowUrl: 'assets/images/marker-shadow.png',
    iconSize: [25, 41], // Tamanho do ícone
    iconAnchor: [12, 41], // Ponto de ancoragem do ícone
    popupAnchor: [1, -34], // Posição do popup em relação ao ícone
    shadowSize: [41, 41], // Tamanho da sombra
});
L.Marker.prototype.options.icon = DefaultIcon;

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
            // Removido o parâmetro de attribution para evitar o rodapé padrão
        }).addTo(this.map);

        // Adicionando marcadores
        this.addMarker(
            [-23.5505, -46.6333],
            'Pousada Feliz',
            '4.8',
            '/intercambio/pousada-feliz'
        );
        this.addMarker(
            [-22.9068, -43.1729],
            'Hostel Aconchego',
            '4.5',
            '/intercambio/hostel-aconchego'
        );
        this.addMarker(
            [-15.7942, -47.8822],
            'Eco Lodge Brasília',
            '4.7',
            '/intercambio/eco-lodge-brasilia'
        );
    }

    private addMarker(
        coords: [number, number],
        name: string,
        rating: string,
        link: string
    ): void {
        const popupContent = `
            <div style="font-family: Arial, sans-serif; font-size: 14px;">
                <strong>${name}</strong><br>
                Avaliação: <span style="color: goldenrod;">&#9733; ${rating}</span><br>
                <a href="${link}" target="_blank" style="color: #007BFF; text-decoration: underline;">Ver detalhes</a>
            </div>
        `;

        L.marker(coords)
            .addTo(this.map)
            .bindPopup(popupContent, { maxWidth: 250, closeButton: true });
    }
}
