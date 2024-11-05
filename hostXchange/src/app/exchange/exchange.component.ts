import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';

interface Exchange {
    id: number;
    localImage: string[];
    cardTitle: string;
    description: string;
    activity: string;
    workDuration: string;
    hostOffers: string;
}

@Component({
    selector: 'app-exchange',
    standalone: true,
    imports: [FooterComponent, MenuComponent, CommonModule],
    templateUrl: './exchange.component.html',
    styleUrl: './exchange.component.css'
})
export class ExchangeComponent implements OnInit {
    exchanges: Exchange[] = [];

    constructor(private router: Router) { }

    ngOnInit(): void {
        // Simulando a obtenção de intercâmbios de um backend
        this.exchanges = [
            {
                id: 1,
                localImage: ['path/to/image1.jpg'],
                cardTitle: 'Intercâmbio em Agricultura',
                description: 'Ajude em uma fazenda orgânica por 2 semanas.',
                activity: 'Agricultura',
                workDuration: '2 semanas',
                hostOffers: 'Alojamento e Alimentação'
            },
            {
                id: 2,
                localImage: ['path/to/image2.jpg'],
                cardTitle: 'Intercâmbio em Cozinha',
                description: 'Trabalhe em um restaurante local por 3 semanas.',
                activity: 'Cozinha',
                workDuration: '3 semanas',
                hostOffers: 'Alojamento e Alimentação'
            },
            // Adicione mais intercâmbios conforme necessário
        ];
    }
}
