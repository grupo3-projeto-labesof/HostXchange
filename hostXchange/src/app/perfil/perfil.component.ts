import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PerfilService } from '../services/perfil.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';


// interface RedeSocial {
//   nome: string;
//   url: string;
// }

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgxMaskDirective, CommonModule, ReactiveFormsModule, MenuComponent, FooterComponent, FormsModule],
  providers: [provideNgxMask(), PerfilService],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})

export class PerfilComponent implements OnInit {
  public userLogado: any = localStorage.getItem("id");
  public verPerfil: any = 0;//Number(localStorage.getItem("verPerfil"));

  public avaliacoesPendentes: any = [];
  public avaliacoesRecebidas: any = [];
  public avaliacoesFeitas: any = [];
  criteriosFaltantes: string[] = [];

  public usuario: any = {};

  public view = 1;

  public notaAvaliacaoUsuario: number = 0;
  public redesSociais: Array<any> = [];
  public redesSociaisOriginais: Array<any> = [];

  //isso aqui só existe para simular o backend
  // usuarioLogado: Usuario = {
  //   idusuario: '1',
  //   nome: 'Jax',
  //   username: 'jaxtoplaner',
  //   rg: '54.921.572-9',
  //   cpf: '493.216.345.44',
  //   senha: '995501',
  //   nrpassa: 'AB12496',
  //   fotoCapa: 'assets/images/perfil/capa.jpg',
  //   fotoPerfil: 'assets/images/perfil/perfil.jpg',
  //   redesSociais: [
  //     { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/jaxtoplaner' },
  //     { nome: 'Twitter', url: 'https://www.twitter.com/jaxtoplaner' },
  //   ]
  // };

  //isso aqui deve ser mudado para o tipo que for recebido na service, provavel any(?)
  // usuarioEditando: Usuario | null = null;
  // editMode = false;
  perfilForm!: FormGroup;
  avaliacaoForm!: FormGroup;
  novaRedeForm!: FormGroup;
  fotoPerfilFile?: File;
  fotoCapaFile?: File;
  senhaAtualCorreta: string = '';
  // notaAvaliacaoUsuario: number = 4.7;
  notaAvaliacao: number = 0;
  comentarioAvaliacao: string = '';
  // mostrarAvaliacoes = false;
  avaliacao: any;

  fotoPerfilPreviewUrl: string = '';
  fotoCapaPreviewUrl: string = '';


  todasRedesSociais: string[] = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'];
  redesSociaisDisponiveis: string[] = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'];

  // Avaliacao: any[] = [];
  // AvaliacaoPendente: any[] = [];
  // avaliacaoPendenteEspecifica: any;

  passwordVisible: PasswordVisibility = {
    current: false,
    new: false,
    confirm: false
  };

  constructor(
    private toastr: ToastrService
    , private service: PerfilService
    , private fb: FormBuilder
    , private cdr: ChangeDetectorRef
    , private ngZone: NgZone
  ) { }


  ngOnInit(): void {
    this.informacoes();
    this.initForm();
  }

  async informacoes() {
    localStorage.setItem('verIntercambio', "0");
    localStorage.setItem('idHost', "0");
    const perfil = this.verPerfil != 0 ? this.verPerfil : this.userLogado;
    this.usuario = [];
    this.avaliacoesFeitas = [];
    this.avaliacoesPendentes = [];
    this.avaliacoesRecebidas = [];
    this.redesSociais = [];
    await this.service.getInformacoes({ idUser: perfil }).subscribe({
      next: async (res: any) => {
        if (res.blOk === true) {
          this.usuario = res.dados;
          this.senhaAtualCorreta = this.usuario.senha;
          const { fotoCapa, fotoPerfil } = res.dados;

          this.perfilForm.patchValue({
            nome: res.dados.nome,
            email: res.dados.email,
            rg: res.dados.rg,
            cpf: res.dados.cpf,
            passaporte: res.dados.nrpassa
          });

          this.carregarRedesSociais(res.dados);
          this.redesSociaisOriginais = [...this.redesSociais];
          this.atualizarRedesSociaisDisponiveis()

          if (!fotoCapa) this.usuario.fotoCapa = 'assets/images/perfil/capa.jpg';
          if (!fotoPerfil) this.usuario.fotoPerfil = 'assets/images/perfil/perfil.jpg';

          this.cdr.detectChanges();

          await this.service.getAvaliacoes({ idUser: perfil }).subscribe({
            next: (res: any) => {
              if (res.blOk === true) {
                const avaliacoes = res.avaliacoes;
                if (this.verPerfil) {
                  avaliacoes.avaliado.map((b: any) => b.snaval === true ? this.avaliacoesRecebidas.push(b) : null);
                  this.notaAvaliacaoUsuario = avaliacoes.media;
                } else {
                  avaliacoes.avaliado.map((b: any) => b.snaval === true ? this.avaliacoesRecebidas.push(b) : null);
                  avaliacoes.avaliador.map((b: any) => b.snaval === true ? this.avaliacoesFeitas.push(b) : b.snaval === false ? this.avaliacoesPendentes.push(b) : null);
                  this.notaAvaliacaoUsuario = avaliacoes.media;
                }
              }
            },
            error: (error) => {
              console.error('Error during getAval:', error);
              this.toastr.warning('Ocorreu um erro durante o carregamento da tela. Por favor, recarregue a página!', 'ATENÇÃO:');
            }
          });
        }
      },
      error: (error) => {
        console.error('Error during getInfos:', error);
        this.toastr.warning('Ocorreu um erro durante o carregamento da tela. Por favor, recarregue a página!', 'ATENÇÃO:');
      }
    });
  }

  get redesSociaisFormArray() {
    return this.perfilForm.get('redesSociais') as FormArray;
  }

  carregarRedesSociais(dados: any) {
    this.redesSociais = []; // Limpa o array existente

    const { facebook, instagram, twitter, linkedin } = dados;

    if (facebook) {
      this.redesSociais.push({ nome: 'Facebook', url: facebook });
    }
    if (instagram) {
      this.redesSociais.push({ nome: 'Instagram', url: instagram });
    }
    if (twitter) {
      this.redesSociais.push({ nome: 'Twitter', url: twitter });
    }
    if (linkedin) {
      this.redesSociais.push({ nome: 'LinkedIn', url: linkedin });
    }

    this.atualizarRedesSociaisDisponiveis();
  }

  hasFotoPerfil(): boolean {
    return !!this.usuario?.fotoPerfil;
  }

  hasFotoCapa(): boolean {
    return !!this.usuario?.fotoCapa;
  }

  initForm() {
    this.perfilForm = this.fb.group({
      fotoPerfil: [this.usuario?.fotoPerfil || 'assets/images/perfil/perfil.jpg'],
      fotoCapa: [this.usuario?.fotoCapa || 'assets/images/perfil/capa.jpg'],
      nome: [this.usuario?.nome, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
      email: [this.usuario?.email, [Validators.required, Validators.email]],
      rg: [this.usuario?.rg, [Validators.required, Validators.minLength(7)]],
      cpf: [this.usuario?.cpf, [Validators.required, Validators.minLength(11)]],
      passaporte: [this.usuario?.nrpassa, [Validators.required, Validators.minLength(8)]],
      redesSociais: this.fb.array([]),
      senhaAtual: ['', Validators.minLength(8)],
      novaSenha: ['', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      confirmarNovaSenha: ['']
    }, {
      validators: [this.passwordRequiredValidator.bind(this), this.passwordMatchValidator]
    });

    this.perfilForm.addControl('novaRedeSocial', this.fb.group({
      nome: [''],
      url: ['https://']
    }));

    //this.setRedesSociais();

    this.avaliacaoForm = this.fb.group({
      avaliacao: [null, Validators.required],
      descricao: ['', Validators.maxLength(200)]
    });
  }

  async salvarAvaliacao() {
    if (this.avaliacaoForm.valid) {
      const avaliacao = {
        idavaliacao: this.avaliacao
        , avaliacao: this.avaliacaoForm.value.avaliacao
        , descricao: this.avaliacaoForm.value.descricao
      };

      await this.service.salvarAvaliacao(avaliacao).subscribe({
        next: (res: any) => {
          if (res.blOk === true) {
            this.toastr.success('Avaliação salva com sucesso!');
            this.avaliacaoForm.reset();
            this.informacoes();
            this.voltar();
          } else {
            this.toastr.error('Erro ao salvar avaliação!');
          }
        },
        error: (error) => {
          console.error('Error during getAval:', error);
          this.toastr.warning('Ocorreu um erro ao salvar a avaliação! Por favor, recarregue a página!', 'ATENÇÃO:');
        }
      });
    }
  }

  acaoAvaliarUsuario(idAvaliacao: string) {
    this.avaliacao = idAvaliacao;
    //this.avaliacaoPendenteEspecifica = this.AvaliacaoPendente.find(avaliacao => avaliacao.idAvaliar === idAvaliacao);
    this.view = 4;
  }

  mostrarAvaliacoesFeitas() {
    this.view = 5;
  }

  verIntercambio() {

  }

  forcaDaSenha: number = 0;
  forcaDaSenhaMensagem: string = '';
  forcaDaSenhaClass: string = '';

  private getCriteriosFaltantes(senha: string): string[] {
    const criterios = [
      { regex: /.{8,}/, mensagem: 'Mínimo de 8 caracteres' },
      { regex: /[A-Z]/, mensagem: 'Uma letra maiúscula' },
      { regex: /[a-z]/, mensagem: 'Uma letra minúscula' },
      { regex: /[0-9]/, mensagem: 'Um número' }
    ];

    return criterios
      .filter(criterio => !criterio.regex.test(senha))
      .map(criterio => criterio.mensagem);
  }

  calcularForcaSenha(senha: string): void {
    if (!senha) {
      this.forcaDaSenha = 0;
      this.forcaDaSenhaMensagem = '';
      this.forcaDaSenhaClass = '';
      this.criteriosFaltantes = []; // Nova propriedade
      return;
    }

    const criteria = [
      { regex: /.{8,}/, weight: 25 },
      { regex: /[A-Z]/, weight: 25 },
      { regex: /[a-z]/, weight: 25 },
      { regex: /[0-9]/, weight: 25 },
    ];

    const forca = criteria.reduce((acc, criterion) =>
      acc + (criterion.regex.test(senha) ? criterion.weight : 0), 0);

    const { mensagem, classe } = this.forcaDaSenhaEMensagem(forca);

    this.forcaDaSenha = forca;
    this.forcaDaSenhaMensagem = mensagem;
    this.forcaDaSenhaClass = classe;
    this.criteriosFaltantes = this.getCriteriosFaltantes(senha); // Atualiza os critérios faltantes
  }

  private forcaDaSenhaEMensagem(forca: number): { mensagem: string, classe: string } {
    if (forca <= 25) {
      return { mensagem: 'Muito fraca', classe: 'bg-danger' };
    } else if (forca <= 50) {
      return { mensagem: 'Fraca', classe: 'bg-warning' };
    } else if (forca <= 75) {
      return { mensagem: 'Média', classe: 'bg-info' };
    } else if (forca < 100) {
      return { mensagem: 'Forte', classe: 'bg-primary' };
    } else {
      return { mensagem: 'Muito forte', classe: 'bg-success' };
    }
  }

  onNovaSenhaChange(): void {
    const novaSenha = this.perfilForm.get('novaSenha')?.value || '';
    this.calcularForcaSenha(novaSenha);
  }

  getNotaFormatada(): string {
    return this.notaAvaliacaoUsuario.toFixed(1);
  }

  cancelarAvaliacao() {
    if (this.avaliacaoForm.dirty || this.avaliacaoForm.value.avaliacao || this.avaliacaoForm.value.descricao) {
      if (!confirm('Existem alterações não salvas. Deseja realmente cancelar?')) {
        return;
      }
    }
    this.avaliacaoForm.reset();
    //this.avaliarUsuario = false;
    //this.avaliacaoPendenteEspecifica = null;
    this.voltar();
  }

  redesSociaisForamAlteradas(): boolean {
    if (this.redesSociais.length !== this.redesSociaisOriginais.length) return true;

    return this.redesSociais.some((rede, index) =>
      rede.nome !== this.redesSociaisOriginais[index]?.nome ||
      rede.url !== this.redesSociaisOriginais[index]?.url
    );
  }

  hasRedesSociais(): boolean {
    return this.usuario && this.usuario.redesSociais ? this.usuario.redesSociais.length > 0 : false;
  }

  // setRedesSociais() {
  //   const formArray = this.perfilForm.get('redesSociais') as FormArray;

  //   if (this.usuario?.redesSociais?.length) {
  //     this.usuario.redesSociais.forEach((rede: RedeSocial) => {
  //       formArray.push(
  //         this.fb.group({
  //           nome: [rede.nome],
  //           url: [rede.url]
  //         })
  //       );
  //     });
  //   }
  //   this.atualizarRedesSociaisDisponiveis();
  // }

  // temAvaliacao(): boolean {
  //   return this.Avaliacao.length > 0;
  // }

  // temAvaliacaoPendente(): boolean {
  //   return this.AvaliacaoPendente.length > 0;
  // }

  // get redesSociais(): FormArray {
  //   return this.perfilForm.get('redesSociais') as FormArray;
  // }

  get novaRedeSocial(): FormGroup {
    return this.perfilForm.get('novaRedeSocial') as FormGroup;
  }

  addRedeSocial() {
    if (this.novaRedeSocial.valid) {
      const novaRede = {
        nome: this.novaRedeSocial.value.nome,
        url: this.novaRedeSocial.value.url
      };

      this.redesSociais.push(novaRede);
      this.novaRedeSocial.reset({ nome: '', url: 'https://' });
      this.atualizarRedesSociaisDisponiveis();
    }
  }

  removeSocialMedia(index: number) {
    const redeRemovida = this.redesSociais[index];

    // Remove do array local
    this.redesSociais.splice(index, 1);

    // Não precisamos modificar this.usuario pois o salvarAlteracoes
    // usa apenas o array redesSociais para construir o objeto data

    // Atualiza a lista de redes disponíveis
    this.atualizarRedesSociaisDisponiveis();
  }

  atualizarRedesSociaisDisponiveis() {
    const redesCadastradas = this.redesSociais.map((rede: any) => rede.nome) || [];
    this.redesSociaisDisponiveis = this.todasRedesSociais.filter(rede =>
      !redesCadastradas.includes(rede)
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const novaSenha = control.get('novaSenha')?.value;
    const confirmarNovaSenha = control.get('confirmarNovaSenha')?.value;
    if (novaSenha && confirmarNovaSenha && novaSenha !== confirmarNovaSenha) {
      return { senhasNaoCompativeis: true };
    }
    return null;
  }

  //função para verificar se a senha atual digitada é igual a senha que vem do banco
  passwordRequiredValidator(control: AbstractControl): ValidationErrors | null {
    const senhaAtual = control.get('senhaAtual')?.value;
    const senhaAtualCorreta = this.senhaAtualCorreta; // Deve ser passada do componente
    if (senhaAtual && senhaAtual !== senhaAtualCorreta) {
      return { senhaAtualIncorreta: true };
    }
    return null;
  }

  togglePasswordVisibility(field: keyof PasswordVisibility) {
    this.passwordVisible[field] = !this.passwordVisible[field];
  }

  onFileSelected(event: Event, tipo: 'perfil' | 'capa') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Por favor, selecione apenas arquivos de imagem.');
        input.value = '';
        return;
      }

      // Verificar tamanho do arquivo (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toastr.error('A imagem deve ter no máximo 5MB.');
        input.value = '';
        return;
      }

      // Criar URL para preview
      const previewUrl = URL.createObjectURL(file);

      // Verificar dimensões
      const img = new Image();
      img.onload = () => {
        const maxWidth = 2048;
        const maxHeight = 2048;

        if (img.width > maxWidth || img.height > maxHeight) {
          this.toastr.error(`A imagem deve ter no máximo ${maxWidth}x${maxHeight} pixels.`);
          input.value = '';
          URL.revokeObjectURL(previewUrl);
          return;
        }

        // Se todas as validações passarem, atualizar o estado
        this.ngZone.run(() => {
          if (tipo === 'perfil') {
            this.fotoPerfilFile = file;
            this.fotoPerfilPreviewUrl = previewUrl;
            this.usuario.fotoPerfil = previewUrl;
          } else {
            this.fotoCapaFile = file;
            this.fotoCapaPreviewUrl = previewUrl;
            this.usuario.fotoCapa = previewUrl;
          }

          // Atualizar o formulário
          this.perfilForm.patchValue({
            [tipo === 'perfil' ? 'fotoPerfil' : 'fotoCapa']: file
          });

          // Forçar detecção de mudanças de forma segura
          Promise.resolve().then(() => {
            this.cdr.detectChanges();
          });
        });
      };

      img.src = previewUrl;
    }
  }

  removerFoto(tipo: 'perfil' | 'capa') {
    if (tipo === 'perfil') {
      if (this.fotoPerfilFile) {
        URL.revokeObjectURL(this.fotoPerfilPreviewUrl);
        this.fotoPerfilFile = undefined;
        this.fotoPerfilPreviewUrl = '';
        //this.usuario.fotoPerfil = 'assets/images/perfil/perfil.jpg';
      }
    } else {
      if (this.fotoCapaFile) {
        URL.revokeObjectURL(this.fotoCapaPreviewUrl);
        this.fotoCapaFile = undefined;
        this.fotoCapaPreviewUrl = '';
        //this.usuario.fotoCapa = 'assets/images/perfil/capa.jpg';
      }
    }

    //this.perfilForm.patchValue({
    //  [tipo === 'perfil' ? 'fotoPerfil' : 'fotoCapa']: ''
    //});

    this.toastr.success(`Foto de ${tipo} removida com sucesso.`);
  }


  async salvarAlteracoes() {
    const formValue = this.perfilForm.value;
    const formData = new FormData();

    formData.append('userId', this.usuario.idusuario);
    formData.append('nome', formValue.nome);
    formData.append('email', formValue.email);
    formData.append('cpf', formValue.cpf);
    formData.append('rg', formValue.rg);
    formData.append('nrpassa', formValue.passaporte);

    if (formValue.fotoPerfil) {
      formData.append('fotoPerfil', formValue.fotoPerfil);
    }
    if (formValue.fotoCapa) {
      formData.append('fotoCapa', formValue.fotoCapa);
    }

    const redes = {
      facebook: this.redesSociais.find(r => r.nome === 'Facebook')?.url ?? '',
      twitter: this.redesSociais.find(r => r.nome === 'Twitter')?.url ?? '',
      instagram: this.redesSociais.find(r => r.nome === 'Instagram')?.url ?? '',
      linkedin: this.redesSociais.find(r => r.nome === 'LinkedIn')?.url ?? ''
    };

    Object.entries(redes).forEach(([nome, url]) => {
      formData.append(nome, url);
    });

    if (formValue.senhaAtual || formValue.novaSenha || formValue.confirmarNovaSenha) {
      if (this.perfilForm.hasError('passwordFieldsRequired')) {
        this.toastr.warning('Todos os campos de senha são necessários');
        return;
      }

      if (this.perfilForm.hasError('passwordMismatch')) {
        this.toastr.warning('As senhas não coincidem');
        return;
      }
      formData.append('senha', formValue.novaSenha);
    }

    await this.service.atualizarPerfil(formData).subscribe({
      next: (res: any) => {
        if (res.blOk === true) {
          this.toastr.success(res.message);
          this.avaliacaoForm.reset();
          this.informacoes();
          this.voltar();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        console.error('Error during getAval:', error);
        this.toastr.warning('Ocorreu um erro durante o carregamento da tela. Por favor, recarregue a página!', 'ATENÇÃO:');
      }
    });
  }

  cancelarAlteracoes() {
    // if (this.perfilForm.dirty || this.redesSociaisForamAlteradas()) {
    // if (!confirm('Existem alterações não salvas. Deseja realmente cancelar?')) {
    //    return;
    //  }
    // }
    // this.editMode = false;
    this.perfilForm.reset();
    this.initForm();
    this.fotoPerfilFile = undefined;
    this.fotoCapaFile = undefined;
    this.redesSociais = this.redesSociaisOriginais;
    this.voltar();
  }

  editar() {
    this.view = 2;
  }

  mostrarAvaliacoes() {
    this.view = 3;
  }

  voltar() {
    this.view = 1;
  }

}
