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

    constructor(private mapService: MapService, private router: Router) {}

    ngOnInit(): void {
        localStorage.setItem('verIntercambio', "0");
        localStorage.setItem('verPerfil'     , "0");
        localStorage.setItem('idHost'        , "0");
        this.initMap();
        this.loadMarkers();
    }

    private initMap(): void {
        this.map = L.map('map', {
            center: [-14.235, -51.9253], // Centro do Brasil
            zoom: 4,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            // Removido o parâmetro de attribution para evitar o rodapé padrão
        }).addTo(this.map);
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
        console.log('Adicionando marcador para ID:', intercambioId); // Verificar se o ID está correto
    
        const popupContent = document.createElement('div');
        popupContent.style.fontFamily = 'Arial, sans-serif';
        popupContent.style.fontSize = '14px';
    
        popupContent.innerHTML = `
            <strong>${name}</strong><br>
            Avaliação: <span style="color: goldenrod;">&#9733; ${rating}</span><br>
        `;
    
        const button = document.createElement('button');
        button.textContent = 'Ver Mais';
        button.style.color = '#007BFF';
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.textDecoration = 'underline';
    
        // Garanta que o ID existe antes de anexar o evento
        if (intercambioId) {
            button.addEventListener('click', () => this.handleVerMais(intercambioId));
        } else {
            console.error('Erro: intercambioId está undefined para este marcador.');
        }
    
        popupContent.appendChild(button);
    
        L.marker(coords)
            .addTo(this.map)
            .bindPopup(popupContent, { maxWidth: 250, closeButton: true });
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