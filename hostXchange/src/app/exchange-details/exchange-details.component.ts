import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExchangeService } from '../services/exchange.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
    selector: 'app-exchange-details',
    standalone: true,
    imports: [CommonModule, FooterComponent, MenuComponent],
    templateUrl: './exchange-details.component.html',
    styleUrls: ['./exchange-details.component.css'],
})
export class ExchangeDetailsComponent implements OnInit {
    selectedExchange: any = null;
    images: string[] = [];
    avaliacoes: any[] = [];

    carouselOptions = {
        loop: true,
        margin: 10,
        nav: true,
        dots: true,
        items: 1, // Apenas uma imagem por vez
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        navText: ['<', '>'], // Botões de navegação
    };

    constructor(private exchangeService: ExchangeService
              , private toastr: ToastrService
              , private location: Location
            ) {}

    ngOnInit(): void {
        localStorage.setItem('verPerfil', "0");
        localStorage.setItem('idHost'   , "0");
        const exchangeId = localStorage.getItem('verIntercambio');

        if (!exchangeId) {
            this.toastr.warning('Nenhum intercâmbio selecionado.');
            this.goBack();
            return;
        }

        this.loadExchangeDetails(Number(exchangeId));
    }

    private async loadExchangeDetails(id: number): Promise<void> {
        await this.exchangeService.getExchangeById({ id }).subscribe({
            next: (response: any) => {
                console.log('Detalhes do intercâmbio:', response);
                this.selectedExchange = response;
    
                // Carregar imagens
                this.images = [
                    response.img1,
                    response.img2,
                    response.img3,
                    response.img4,
                    response.img5,
                    response.img6,
                    response.img7,
                    response.img8,
                    response.img9,
                    response.img10,
                ].filter((img) => img); // Filtrar imagens não nulas
    
                console.log('Host: ', response.idhost);
                // Carregar avaliações do host
                this.avaliacoes = response.contatoHost?.usuario?.avaliacoesComoAvaliado || [];
            },
            error: (err) => {
                console.error('Erro ao carregar detalhes do intercâmbio:', err);
                this.toastr.error('Erro ao carregar detalhes do intercâmbio.');
                this.goBack();
            },
        });
    }    

    goBack(): void {
        localStorage.setItem('verIntercambio', "0");
        this.location.back();
    }

    async applyForExchange(): Promise<void> {
        const data = {idviajante: Number(localStorage.getItem("id")), idinterc: this.selectedExchange.idinterc };
        if(data.idviajante === this.selectedExchange.contatoHost.usuario.idusuario) {
            this.toastr.warning("Você é o host deste intercâmbio e não pode se candidatar!", "ATENÇÃO: ")
        } else {
            await this.exchangeService.seCandidatar(data).subscribe({
                next: (res: any) => {
                    if(res.success === true) {
                        this.toastr.success('Você se candidatou ao intercâmbio com sucesso!', 'PARABÉNS: ');
                    } else {
                        this.toastr.success(res.message);
                    }
                },
                error: (err) => {
                    console.error('Erro ao carregar detalhes do intercâmbio:', err);
                    this.toastr.error('Erro ao carregar detalhes do intercâmbio.', 'ERRO: ');
                },
            })
        }
    }
}