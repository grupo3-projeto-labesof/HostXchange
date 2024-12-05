import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';
import { MapService } from '../services/map.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, FooterComponent, MenuComponent],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
    private map: any;

    constructor(private mapService: MapService, private router: Router) { }

    ngOnInit(): void {
        localStorage.setItem('verIntercambio', "0");
        localStorage.setItem('verPerfil', "0");
        localStorage.setItem('idHost', "0");
        this.initMap();
        this.loadMarkers();
    }

    private initMap(): void {
        this.map = L.map('map', {
            zoomControl: false,
        }).setView([-14.235, -51.9253], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);

        const bounds = L.latLngBounds(
            L.latLng(-33.742, -73.982), 
            L.latLng(5.271, -34.793)
        );
        this.map.setMaxBounds(bounds);
        this.map.fitBounds(bounds);
        this.map.on('drag', () => {
            this.map.panInsideBounds(bounds, { animate: true });
        });
    }



    private loadMarkers(): void {
        this.mapService.getIntercambios().subscribe({
            next: (response: any) => {
                console.log('Intercambios recebidos:', response); // Log para verificar os dados
                if (response.blOk) {
                    response.data.forEach((intercambio: any) => {
                        console.log('Intercambio individual:', intercambio); // Verificar o objeto individual
                        this.addMarker(
                            [intercambio.latitude, intercambio.longitude],
                            intercambio.titulo,
                            intercambio.avaliacao,
                            intercambio.id // Certifique-se de que este campo existe
                        );
                    });
                }
            },
            error: (err: any) => {
                console.error('Erro ao carregar intercâmbios:', err);
            }
        });
    }

    private addMarker(
        coords: [number, number],
        name: string,
        rating: string,
        intercambioId: number
    ): void {
        const customIcon = L.icon({
            iconUrl: 'assets/custom-marker.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    
        // Estilização do popup
        const popupContent = document.createElement('div');
        popupContent.style.fontFamily = 'Arial, sans-serif';
        popupContent.style.fontSize = '14px';
        popupContent.style.border = '1px solid #ccc';
        popupContent.style.borderRadius = '8px';
        popupContent.style.padding = '15px';
        popupContent.style.backgroundColor = '#ffffff';
        popupContent.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    
        // Conteúdo do popup
        popupContent.innerHTML = `
            <div style="text-align: center;">
                <strong style="font-size: 16px; color: #333;">${name}</strong>
                <div style="margin: 8px 0; color: goldenrod;">
                    &#9733; Avaliação: ${rating}
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">
            </div>
        `;
    
        const button = document.createElement('button');
        button.innerHTML = `<i class="fas fa-info-circle" style="margin-right: 8px;"></i> Ver Mais`; // Ícone e texto
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.transition = 'background-color 0.3s';
    
        // Hover no botão
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#0056b3';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#007BFF';
        });
    
        button.addEventListener('click', () => this.handleVerMais(intercambioId));
    
        popupContent.appendChild(button);
    
        L.marker(coords, { icon: customIcon })
            .addTo(this.map)
            .bindPopup(popupContent, { maxWidth: 300, closeButton: true });
    }
    
    


    private handleVerMais(intercambioId: number): void {
        if (!intercambioId) {
            console.error('Erro: intercambioId é inválido.');
            return;
        }

        // Armazena o ID no localStorage
        console.log('Armazenando ID no localStorage:', intercambioId);
        localStorage.setItem('verIntercambio', intercambioId.toString());

        // Redireciona para a rota de detalhes
        this.router.navigate(['/intercambio']);
    }

}