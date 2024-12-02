import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ExchangeService } from '../services/exchange.service';

interface Exchange {
    idinterc: number;
    localImage: string[]; // URLs das imagens
    titulo: string;
    nmlocal: string;
    descricao: string;
    servicos: string;
    beneficios: string;
    duracao: string;
    idhost: number;
    contatoHost: {
        nmprop: string;
        endereco: string;
        numero: string;
        complem: string;
        cdestado: string;
        cidade: string;
        nrcep: string;
        nrtel: string;
        tipoProp: string;
        email: string;
        usuario: {
            avaliacoesComoAvaliado: { avaliacao: number }[];
        };
    };
}

@Component({
    selector: 'app-exchange',
    standalone: true,
    imports: [FooterComponent, MenuComponent, CommonModule],
    templateUrl: './exchange.component.html',
    styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {
    exchanges: Exchange[] = [];
    filteredExchanges: Exchange[] = [];
    searchMessage: string = '';

    constructor(private router: Router, private exchangeService: ExchangeService) { }

    ngOnInit(): void {
        localStorage.setItem('verIntercambio', "0");
        localStorage.setItem('verPerfil'     , "0");
        localStorage.setItem('idHost'        , "0");
        this.loadExchanges();
    }

    loadExchanges(): void {
        this.exchangeService.buscarIntercambios().subscribe({
            next: (data: any[]) => {
                this.exchanges = data.map(intercambio => ({
                    ...intercambio,
                    localImage: [
                        intercambio.img1, // Usa a rota salva no banco de dados
                        intercambio.img2,
                        intercambio.img3,
                        intercambio.img4,
                        intercambio.img5,
                        intercambio.img6,
                        intercambio.img7,
                        intercambio.img8,
                        intercambio.img9,
                        intercambio.img10
                    ].filter(Boolean) // Filtra imagens não nulas
                }));
                this.filteredExchanges = this.exchanges;
            },
            error: (err) => {
                console.error('Erro ao buscar intercâmbios:', err);
            }
        });
    }

    buscarIntercambios(titulo: string): void {
        const lowerCaseTitle = titulo.toLowerCase();
        this.filteredExchanges = this.exchanges.filter(exchange =>
            exchange.titulo.toLowerCase().includes(lowerCaseTitle)
        );

        if (this.filteredExchanges.length === 0) {
            this.searchMessage = 'Nenhum intercâmbio encontrado com esse título.';
        } else {
            this.searchMessage = '';
        }
    }

    calcularMediaAvaliacoes(avaliacoes: { avaliacao: number }[]): string {
        if (avaliacoes.length === 0) return '☆☆☆☆☆';
        const soma = avaliacoes.reduce((acc, val) => acc + val.avaliacao, 0);
        const media = soma / avaliacoes.length;
        return '★'.repeat(Math.round(media)) + '☆'.repeat(5 - Math.round(media));
    }

    verDetalhes(id: number): void {
        localStorage.setItem('verIntercambio', id.toString());
        this.router.navigate(['/intercambio']);
    }
}