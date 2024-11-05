import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ExchangeService } from '../services/exchange.service';

@Component({
    selector: 'app-form-exchange',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule, MenuComponent, FooterComponent],
    templateUrl: './form-exchange.component.html',
    styleUrl: './form-exchange.component.css'
})
export class FormExchangeComponent implements OnInit {

    formExchange!: FormGroup;

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

    onSubmit(): void {
        if (this.formExchange.valid) {
            this.exchangeService.cadastrarIntercambio(this.formExchange.value).subscribe({
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
