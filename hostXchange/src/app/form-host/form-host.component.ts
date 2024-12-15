import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HostService } from '../services/host.service';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-host',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgxMaskDirective, MenuComponent, FooterComponent],
  providers: [provideNgxMask()],
  templateUrl: './form-host.component.html',
  styleUrl: './form-host.component.css'
})
export class FormHostComponent implements OnInit {

  formHost!: FormGroup;
  estados: any[] = [];
  cidades: any[] = [];
  cidadeNome: string = '';
  estadoNome: string = '';

  constructor(
      private fb         : FormBuilder
    , private http       : HttpClient
    , private hostService: HostService
    , private toastr     : ToastrService
    , private router     : Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.buscarEstados();
  }

  inicializarFormulario() {
    this.formHost = this.fb.group({
      nomePropriedade: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
      rua            : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
      numero         : ['', Validators.required],
      complemento    : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      cidade         : ['', Validators.required],
      estado         : ['', Validators.required],
      cep            : ['', Validators.required],
      tipoPropriedade: ['', Validators.required],
      telefone       : ['', Validators.required],
      email          : ['', [Validators.email]],
      latitude       : '',
      longitude      : ''
    });
  }

  onlyLetters(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);

    const pattern = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;

    if (pattern.test(char)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  async buscarEstados(): Promise<void> {
    try {
      const estadosData = await this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').toPromise();

      estadosData ? this.estados = estadosData.sort((a, b) => a.nome.localeCompare(b.nome)) : alert("Erro ao pesquisar CEP;");
    } catch (error) {
      alert('Erro ao buscar estados. Tente novamente mais tarde.');
    }
  }

  async getLatLngFromForm(): Promise<{ lat: number; lng: number } | null> {
    const rua = this.formHost.get('rua')?.value;
    const numero = this.formHost.get('numero')?.value;
    const cidade = this.formHost.get('cidade')?.value;
    const estado = this.formHost.get('estado')?.value;
    const cep = this.formHost.get('cep')?.value;
  
    // Monta o endereço completo
    const enderecoCompleto = `${rua}, ${numero}, ${cidade}, ${estado}, ${cep}`;
  
    try {
      const apiKey = "80cb33d04dc744f7bac3064fb2d0fb3a";
      const response = await this.http
        .get<any>(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(enderecoCompleto)}&key=${apiKey}`)
        .toPromise();
  
      if (response.results.length > 0) {
        const location = response.results[0].geometry;
        return { lat: location.lat, lng: location.lng };
      } else {
        console.error('Nenhuma localização encontrada para o endereço fornecido.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar latitude e longitude:', error);
      return null;
    }
  }
  

  async onEstadoChange(estadoId: string): Promise<void> {
    try {
      const cidadesData = await this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`).toPromise();
      cidadesData ? this.cidades = cidadesData.sort((a, b) => a.nome.localeCompare(b.nome)) : alert("Erro ao pesquisar CEP.");
    } catch (error) {
      alert('Erro ao buscar cidades. Tente novamente mais tarde.');
    }
  }

  async buscarCep(): Promise<void> {
    let cep = this.formHost.get('cep')?.value;

    cep = cep.replace(/\D/g, '');

    try {

      const dados = await this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).toPromise();

      if (!dados.erro) {
        if (dados.logradouro != '') {
          this.formHost.patchValue({ rua: dados.logradouro });
        }

        if (dados.uf) {
          const estadoCorrespondente = this.estados.find((e) => e.sigla === dados.uf);
          if (estadoCorrespondente) {
            this.formHost.patchValue({ estado: estadoCorrespondente.id });
            this.estadoNome = estadoCorrespondente.nome;
            await Promise.all([
              this.onEstadoChange(estadoCorrespondente.id),
              new Promise(resolve => setTimeout(resolve, 100))
            ]);
          } else {
            alert('Estado não encontrado para a sigla: ' + dados.uf);
          }
        }

        if (dados.localidade) {
          const cidadeCorrespondente = this.cidades.find(c => c.nome.toLowerCase() === dados.localidade.toLowerCase());
          if (cidadeCorrespondente) {
            this.formHost.patchValue({ cidade: cidadeCorrespondente.id });
            this.cidadeNome = cidadeCorrespondente.nome;
          } else {
            alert('Cidade não encontrada na lista para o nome: ' + dados.localidade);
          }
        }

      } else {
        alert('CEP não encontrado.');
      }
    } catch (error) {
      if (cep === '') {
        alert('Erro ao buscar CEP. O campo está vazio.');
      } else {
        alert('Erro ao buscar CEP: ' + cep + '. Tem certeza que o CEP existe? Tente novamente.');
      }
    }
  }

  getErrorMessage(campoNome: string): string[] {
    const campo = this.formHost.get(campoNome);
    const controle = campo?.errors;
    const mensagensErro: string[] = [];

    if (controle) {
      if (controle['required']) {
        mensagensErro.push(`O campo ${this.getFieldName(campoNome)} é obrigatório.`);
      }
      if (controle['minlength']) {
        mensagensErro.push(`O campo ${this.getFieldName(campoNome)} precisa ter no mínimo ${controle['minlength'].requiredLength} caracteres.`);
      }
      if (controle['maxlength']) {
        mensagensErro.push(`O campo ${this.getFieldName(campoNome)} pode ter no máximo ${controle['maxlength'].requiredLength} caracteres.`);
      }
      if (controle['pattern']) {
        if (campoNome === 'cep') {
          mensagensErro.push(`O campo ${this.getFieldName(campoNome)} deve estar no formato 00000-000.`);
        }
      }
      if (controle['email']) {
        mensagensErro.push('Formato de e-mail inválido.');
      }
    }

    return mensagensErro;
  }

  getFieldName(fieldName: string): string {
    switch (fieldName) {
      case 'nomePropriedade': return 'Nome da Propriedade';
      case 'tipoPropriedade': return 'Tipo da Propriedade';
      case 'rua': return 'Rua';
      case 'complemento': return 'Complemento';
      case 'numero': return 'Número';
      case 'cep': return 'CEP';
      case 'cidade': return 'Cidade';
      case 'estado': return 'Estado';
      case 'telefone': return 'Telefone';
      case 'email': return 'E-mail';
      default: return fieldName;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.formHost.valid) {
      this.formHost.patchValue({cidade: this.cidadeNome, estado: this.estadoNome});
      try {
        // Buscar latitude e longitude
        const location = await this.getLatLngFromForm();
  
        if (location) {
          // Atualizar o formulário com latitude e longitude
          this.formHost.patchValue({
            latitude: location.lat,
            longitude: location.lng,
          });
        } else {
          console.log('Não foi possível encontrar a localização exata.');
        }
      } catch (error) {
        console.error('Erro ao buscar latitude e longitude:', error);
      }
      let data = this.formHost.value;
      
      data.idUsuario = localStorage.getItem("id");
      await this.hostService.enviarFormulario(data).subscribe({
        next: (res: any) => {
          if(res.success) {
            localStorage.setItem("idHost", res.idHost);
            localStorage.setItem("tipo_user", "H");
            this.router.navigate(['/cadastrar-intercambio']);
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err) => {
          console.log("Erro: ", err);
          this.toastr.error('Erro ao enviar dados, tente novamente mais tarde! ' + err);
        }
      });
      
    } else {
      this.toastr.warning('Formulário inválido!');
    }
  }


}