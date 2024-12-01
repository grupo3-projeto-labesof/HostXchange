import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';

@Component({
    selector: 'app-exchange-details',
    standalone: true,
    imports: [FooterComponent, MenuComponent, CommonModule],
    templateUrl: './exchange-details.component.html',
    styleUrl: './exchange-details.component.css'
})
export class ExchangeDetailsComponent implements OnInit {
    selectedExchange: any = null; // Dados do intercâmbio selecionado

    constructor(private router: Router) { }

    ngOnInit(): void {
        // Dados mockados (substitua com seus dados fixos)
        const mockData = [
            {
                id: 1,
                titulo: 'Intercâmbio em Agricultura',
                descricao: 'Ajude em uma fazenda orgânica por 2 semanas.',
                servicos: 'Alojamento, Refeições',
                beneficios: 'Aprendizado prático, Experiência cultural',
                duracao: '2 semanas',
                img: 'https://via.placeholder.com/400x200?text=Intercambio+1', // URL mockada para a imagem
                contatoHost: {
                    nmprop: 'João Silva',
                    endereco: 'Rua das Flores, 123',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    telefone: '(11) 98765-4321',
                    email: 'joao.silva@example.com',
                },
            },
            {
                id: 2,
                titulo: 'Intercâmbio em Cozinha',
                descricao: 'Trabalhe em um restaurante local por 3 semanas.',
                servicos: 'Alojamento, Alimentação',
                beneficios: 'Experiência na culinária local',
                duracao: '3 semanas',
                img: 'https://via.placeholder.com/400x200?text=Intercambio+2', // URL mockada para a imagem
                contatoHost: {
                    nmprop: 'Maria Oliveira',
                    endereco: 'Rua Gourmet, 45',
                    cidade: 'Rio de Janeiro',
                    estado: 'RJ',
                    telefone: '(21) 99876-5432',
                    email: 'maria.oliveira@example.com',
                },
            },
        ];

        // Simula a seleção de um intercâmbio pelo ID (por exemplo, ID = 1)
        const exchangeId = 1; // Substituir pelo ID dinâmico, se necessário
        this.selectedExchange = mockData.find((exchange) => exchange.id === exchangeId);
    }

    goBack(): void {
        this.router.navigate(['/exchanges']); // Simula o botão "Voltar"
    }

    applyForExchange(): void {
        alert('Você se candidatou ao intercâmbio com sucesso!');
    }
}
