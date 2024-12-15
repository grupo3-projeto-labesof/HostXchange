import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ExchangeService } from '../services/exchange.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
//import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//     name: 'filePreview',
//     standalone: true // Marca a pipe como standalone
// })
// export class FilePreviewPipe implements PipeTransform {
//     transform(file: File): string {
//         return URL.createObjectURL(file); // Gera uma URL para o arquivo
//     }
// }

@Component({
    selector: 'app-form-exchange',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MenuComponent,
        FooterComponent,
        //FilePreviewPipe,
    ],
    templateUrl: './form-exchange.component.html',
    styleUrls: ['./form-exchange.component.css']
})
export class FormExchangeComponent implements OnInit {
    formExchange! : FormGroup;
    selectedImages: File[] = [];
    cardTitle     : String = "";

    constructor(
        private fb             : FormBuilder,
        private exchangeService: ExchangeService,
        private toastr         : ToastrService, 
        private router         : Router
    ) {}

    ngOnInit(): void {
        this.inicializarFormulario();
    }

    inicializarFormulario() {
        this.formExchange = this.fb.group({
            titulo    : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
            descricao : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
            servicos  : ['', Validators.required],
            beneficios: ['', Validators.required],
            duracao   : ['', Validators.required],
        });
    }

    onFileChange(event: any): void {
        const files = Array.from(event.target.files) as File[]; // Obtém os arquivos como um array

        if (files.length > 10) {
            this.toastr.warning('Você só pode selecionar até 10 imagens.');
            return;
        }

        this.selectedImages = files; // Armazena os arquivos selecionados
        console.log('Imagens selecionadas:', this.selectedImages.map(file => file.name));
    }

    async onSubmit(): Promise<void> {
        if (this.formExchange.valid) {
            const formData = new FormData(); // Usando FormData para permitir envio de arquivos
    
            // Adiciona os campos do formulário ao FormData
            formData.append('titulo', this.formExchange.value.titulo);
            formData.append('descricao', this.formExchange.value.descricao);
            formData.append('servicos', this.formExchange.value.servicos);
            formData.append('beneficios', this.formExchange.value.beneficios);
            formData.append('duracao', this.formExchange.value.duracao);
    
            const idHost = localStorage.getItem('idHost');
            if (!idHost || idHost === "0") {
                this.toastr.warning('ID do host não encontrado! Faça login novamente.');
                return;
            }
            formData.append('idhost', idHost);
    
            // Adiciona as imagens ao FormData
            this.selectedImages.forEach((file, index) => {
                formData.append('images', file, file.name); // Importante usar o mesmo nome de campo 'images'
            });
    
            // Envia os dados para o serviço
            await this.exchangeService.cadastrarIntercambio(formData).subscribe({
                next: (res: any) => {
                    if (res.blOk === true) {
                        localStorage.setItem("idHost", "0");
                        localStorage.setItem("idIntercambio", res.intercambio.idinterc);
                        this.router.navigate(['/home']);
                        this.toastr.success(res.message);
                    } else {
                        this.toastr.error(res.message);
                    }
                },
                error: (err) => {
                    console.error('Erro ao cadastrar intercâmbio:', err);
                    this.toastr.error('Erro ao cadastrar intercâmbio, tente novamente mais tarde!');
                }
            });
        } else {
            this.toastr.warning('Formulário inválido! Verifique os campos e tente novamente.');
        }
    }
    
}