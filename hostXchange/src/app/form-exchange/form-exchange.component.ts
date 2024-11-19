import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ExchangeService } from '../services/exchange.service';

@Component({
    selector: 'app-form-exchange',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MenuComponent, FooterComponent],
    templateUrl: './form-exchange.component.html',
    styleUrls: ['./form-exchange.component.css']
})
export class FormExchangeComponent implements OnInit {

    formExchange!: FormGroup;
    selectedImage: File | null = null; // Para armazenar a imagem selecionada

    constructor(private fb: FormBuilder, private http: HttpClient, private exchangeService: ExchangeService) { }

    ngOnInit(): void {
        this.inicializarFormulario();
    }

    inicializarFormulario() {
        this.formExchange = this.fb.group({
            titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
            descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
            horasSemanais: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            tipoAtividade: ['', Validators.required],
            cidade: ['', Validators.required],
            estado: ['', Validators.required]
        });
    }

    // Função para lidar com a mudança do arquivo
    onFileChange(event: any): void {
        const file = event.target.files[0]; // Obtém o primeiro arquivo selecionado
        if (file) {
            this.selectedImage = file; // Armazena o arquivo selecionado
            console.log('Imagem selecionada: ', file.name);
            // Aqui você pode adicionar lógica para pré-visualizar a imagem, se necessário
        }
    }

    onSubmit(): void {
        if (this.formExchange.valid) {
            const formData = new FormData();
            formData.append('titulo', this.formExchange.value.titulo);
            formData.append('descricao', this.formExchange.value.descricao);
            formData.append('horasSemanais', this.formExchange.value.horasSemanais);
            formData.append('tipoAtividade', this.formExchange.value.tipoAtividade);
            formData.append('cidade', this.formExchange.value.cidade);
            formData.append('estado', this.formExchange.value.estado);
            if (this.selectedImage) {
                formData.append('imagem', this.selectedImage); // Adiciona a imagem ao FormData
            }

            this.exchangeService.cadastrarIntercambio(formData).subscribe({
                next: (response) => {
                    console.log('Intercâmbio cadastrado com sucesso: ', response);
                    alert('Intercâmbio cadastrado com sucesso!');
                },
                error: (err) => {
                    alert('Erro ao cadastrar intercâmbio, tente novamente mais tarde! ' + err);
                }
            });
        } else {
            alert('Formulário inválido! Verifique os campos e tente novamente.');
        }
    }
}
