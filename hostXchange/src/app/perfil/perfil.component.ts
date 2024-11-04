import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PerfilService } from '../services/perfil.service';
import * as bootstrap from 'bootstrap';


interface RedeSocial {
  nome: string;
  link: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask(), PerfilService],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})

export class PerfilComponent implements OnInit {
  infoPessoalForm: FormGroup;
  senhaForm: FormGroup;
  redeSocialForm: FormGroup;
  redesDisponiveis = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'];
  // Sinais para controlar o carregamento da página e dos modais
  carregando = signal(true);
  carregandoModalInfo = signal(false);
  carregandoModalFotoPerfil = signal(false);
  carregandoModalCapa = signal(false);
  carregandoModalSocial = signal(false);
  carregandoModalSenha = signal(false);
  redeEditandoIndex: number | null = null; // Índice da rede que está sendo editada
  nomeEditando: string = ''; // Nome da rede social em edição
  linkEditando: string = ''; // Link da rede social em edição
  modoEdicao: boolean = false; // Controle de estado de edição
  senhaAtualVisivel = false;
  novaSenhaVisivel = false;
  confirmarSenhaVisivel = false;
  @ViewChild('editPersonalInfoModal') editPersonalInfoModal!: ElementRef;
  modal!: bootstrap.Modal;


  // Tipando corretamente o objeto usuário
  usuario = signal({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    cpf: '',
    rg: '',
    passaporte: '',
    fotoPerfil: 'perfil.jpg',
    fotoCapa: 'capa.jpg',
    redesSociais: [] as RedeSocial[] // Definindo que é um array de RedeSocial
  });

  constructor(private fb: FormBuilder, private perfilService: PerfilService) {
    // Formulário de Informações Pessoais
    this.infoPessoalForm = this.fb.group({
      nomeUsuario: ['', Validators.required],
      telefoneUsuario: ['', Validators.required],
      emailUsuario: ['', [Validators.required, Validators.email]],
      cpfUsuario: ['', Validators.required],
      rgUsuario: ['', Validators.required],
      passaporteUsuario: ['']
    });

    // Formulário de Senha
    this.senhaForm = this.fb.group({
      senhaAtual: ['', [Validators.required, this.validarSenhaAtual.bind(this)]],
      novaSenha: ['', [Validators.required, this.validarForcaSenha]],
      confirmarSenha: ['', [Validators.required, this.validarConfirmacaoSenha.bind(this)]]
    });

    // Formulário para Adicionar/Editar Redes Sociais
    this.redeSocialForm = this.fb.group({
      rede: ['', Validators.required], // Nome da rede social
      link: ['', [Validators.required, this.socialMediaLinkValidator(['instagram.com', 'linkedin.com', 'facebook.com', 'twitter.com'])]] // Link com validação de URL
    });
  }

  ngOnInit(): void {
    this.carregarPerfilUsuario();

    const modalElement = document.getElementById('editPersonalInfoModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.limparEstadoPagina();
      });
    }
  }

  confirmarFechamentoModal(): void {
    if (this.infoPessoalForm.dirty || this.senhaForm.dirty) {
      const desejaFechar = confirm('Você tem alterações não salvas. Deseja realmente sair sem salvar?');
      if (desejaFechar) {
        this.fecharModal();
      }
    } else {
      this.fecharModal();
    }
  }

  fecharModal(): void {
    const modalElement = document.getElementById('editPersonalInfoModal')!;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();

    // Reseta os formulários
    this.resetarFormularios();
  }

  limparEstadoPagina(): void {
    // Remove qualquer backdrop residual
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    // Remove a classe modal-open que impede a rolagem
    document.body.classList.remove('modal-open');

    // Limpa qualquer padding residual aplicado ao body
    document.body.style.removeProperty('padding-right');

    // Garante que a rolagem seja restaurada
    document.body.style.overflow = 'auto';
  }

  private socialMediaLinkValidator(domains: string[]) {
    const regex = new RegExp(`^(https?:\\/\\/)?(www\\.)?(${domains.join('|')})\\/([a-zA-Z0-9._-]+)$`);

    return (control: any) => {
      const value = control.value;
      return value && !regex.test(value) ? { invalidSocialMediaLink: true } : null;
    };
  }

  // Fechar modal com confirmação se há alterações
  confirmarFechar(): void {
    if (this.infoPessoalForm.dirty || this.senhaForm.dirty) {
      if (confirm('Há alterações não salvas. Deseja realmente fechar o modal?')) {
        this.resetarFormularios();
        // O Bootstrap fecha automaticamente com data-bs-dismiss
      }
    }
  }

  // Cancelar Alterações
  cancelarAlteracoes(): void {
    if (confirm('Tem certeza que deseja descartar todas as alterações?')) {
      this.resetarFormularios();
    }
  }

  resetarFormularios(): void {
    // Resetando o formulário de informações pessoais com os dados atuais do usuário
    this.infoPessoalForm.reset({
      nomeUsuario: this.usuario().nome,
      telefoneUsuario: this.usuario().telefone,
      emailUsuario: this.usuario().email,
      cpfUsuario: this.usuario().cpf,
      rgUsuario: this.usuario().rg,
      passaporteUsuario: this.usuario().passaporte
    });

    // Reseta o formulário de senha
    this.senhaForm.reset();
  }

  // Validações da senha (ajuste necessário)
  validarSenhaAtual(control: AbstractControl): { [key: string]: boolean } | null {
    const senhaDigitada = control.value;
    const senhaAtual = this.usuario().senha;  // Certifique-se de que this.usuario().senha contém a senha correta
    if (senhaDigitada !== senhaAtual) {
      return { senhaIncorreta: true };
    }
    return null;
  }

  editarRedeSocial(index: number) {
    const rede = this.usuario().redesSociais[index];
    this.redeEditandoIndex = index;
    this.nomeEditando = rede.nome; // Preenche com o nome atual
    this.linkEditando = rede.link; // Preenche com o link atual
    this.modoEdicao = true; // Habilita o modo de edição
  }

  salvarEdicaoRedeSocial() {
    if (this.redeEditandoIndex !== null && this.nomeEditando.trim() && this.linkEditando.trim()) {
      // Atualiza a rede social com os valores editados
      this.usuario().redesSociais[this.redeEditandoIndex].nome = this.nomeEditando.trim();
      this.usuario().redesSociais[this.redeEditandoIndex].link = this.linkEditando.trim();
      this.cancelarEdicaoRedeSocial(); // Sai do modo de edição
    }
  }

  cancelarEdicaoRedeSocial() {
    this.redeEditandoIndex = null;
    this.nomeEditando = '';
    this.linkEditando = '';
    this.modoEdicao = false; // Desativa o modo de edição
  }

  /*
  cancelarAlteracoes() {
    if (this.infoPessoalForm.dirty) {
      return window.confirm('Você tem alterações não salvas. Deseja realmente sair?');
    }
    return true;
  }
    */

  // Carregar os dados do usuário
  carregarPerfilUsuario(): void {
    this.perfilService.obterPerfilUsuario().subscribe(dadosUsuario => {
      this.usuario.set(dadosUsuario);
      this.infoPessoalForm.patchValue({
        nomeUsuario: dadosUsuario.nome,
        telefoneUsuario: dadosUsuario.telefone,
        emailUsuario: dadosUsuario.email,
        cpfUsuario: dadosUsuario.cpf,
        rgUsuario: dadosUsuario.rg,
        passaporteUsuario: dadosUsuario.passaporte
      });
      this.carregando.set(false);
    });
  }

  // Alterar foto de perfil
  alterarFotoPerfil(event: any) {
    const arquivo = event.target.files[0];
    if (arquivo) {
      // Atualizando diretamente a foto de perfil no signal
      this.perfilService.enviarFoto(arquivo).subscribe((novaFotoPerfil) => {
        this.usuario.set({ ...this.usuario(), fotoPerfil: novaFotoPerfil });
      });
    }
  }

  // Alterar foto de capa
  alterarFotoCapa(event: any) {
    const arquivo = event.target.files[0];
    if (arquivo) {
      // Atualizando diretamente a foto de capa no signal
      this.perfilService.enviarFoto(arquivo).subscribe((novaFotoCapa) => {
        this.usuario.set({ ...this.usuario(), fotoCapa: novaFotoCapa });
      });
    }
  }

  abrirModalSenha() {
    this.carregandoModalSenha.set(true);
    this.perfilService.obterSenhaUsuario().subscribe(senha => {
      this.senhaForm.patchValue({ senhaAtual: senha });
      this.carregandoModalSenha.set(false);
    });
  }

  // Salvar informações pessoais
  salvarInfoPessoal() {
    if (this.infoPessoalForm.valid) {
      const dadosAtualizados = {
        ...this.infoPessoalForm.value,
        fotoPerfil: this.usuario().fotoPerfil,
        fotoCapa: this.usuario().fotoCapa,
        redesSociais: this.usuario().redesSociais // Inclui redes sociais
      };

      this.perfilService.atualizarPerfilUsuario(dadosAtualizados).subscribe(() => {
        this.carregarPerfilUsuario();
        alert('Informações salvas com sucesso!');
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }

  // Adicionar nova rede social
  adicionarRedeSocial() {
    if (this.redeSocialForm.valid) {
      const novaRede = this.redeSocialForm.value;
      const redesAtuais = this.usuario().redesSociais;

      // Verifica se a rede já existe
      if (!redesAtuais.find(rede => rede.nome === novaRede.rede)) {
        redesAtuais.push({ nome: novaRede.rede, link: novaRede.link });
        this.usuario.set({ ...this.usuario(), redesSociais: redesAtuais });
        this.redeSocialForm.reset();
        this.redeSocialForm.markAsPristine();
        this.redeSocialForm.markAsUntouched();
        this.redesDisponiveisFiltradas();
        this.redeSocialForm.updateValueAndValidity();
      } else {
        alert('Esta rede social já está cadastrada.');
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  // Remover rede social com confirmação
  removerRedeSocial(nomeRede: string) {
    if (confirm('Tem certeza que deseja remover esta rede social?')) {
      const redesAtuais = this.usuario().redesSociais.filter(rede => rede.nome !== nomeRede);
      this.usuario.set({ ...this.usuario(), redesSociais: redesAtuais });
    }
  }

  // Obter redes disponíveis que ainda não foram adicionadas
  redesDisponiveisFiltradas() {
    const redesAtuais = this.usuario().redesSociais.map(rede => rede.nome);
    return this.redesDisponiveis.filter(rede => !redesAtuais.includes(rede));
  }

  // Abrir modal de informações pessoais
  abrirModalInfo() {
    this.carregandoModalInfo.set(true);
    setTimeout(() => {
      this.carregandoModalInfo.set(false); // Simulando carregamento rápido
    }, 500);
  }

  // Abrir modal de foto de perfil
  abrirModalFotoPerfil() {
    this.carregandoModalFotoPerfil.set(true);
    setTimeout(() => {
      this.carregandoModalFotoPerfil.set(false);
    }, 500);
  }

  // Abrir modal de foto de capa
  abrirModalCapa() {
    this.carregandoModalCapa.set(true);
    setTimeout(() => {
      this.carregandoModalCapa.set(false);
    }, 500);
  }

  // Abrir modal de redes sociais
  abrirModalSocial() {
    this.carregandoModalSocial.set(true);
    setTimeout(() => {
      this.carregandoModalSocial.set(false);
    }, 500);
  }

  // Carregar a senha apenas quando o modal de redefinição de senha for aberto
  carregarSenhaUsuario() {
    this.carregandoModalSenha.set(true); // Iniciar o loader do modal
    this.perfilService.obterSenhaUsuario().subscribe((senha) => {
      this.usuario.set({ ...this.usuario(), senha }); // Atualiza o usuário com a senha
      this.carregandoModalSenha.set(false); // Desativa o loader
    });
  }

  /*

  // Valida se a senha atual está correta (com base na senha carregada)
  validarSenhaAtual(control: AbstractControl): { [key: string]: boolean } | null {
    const senhaDigitada = control.value;
    if (senhaDigitada !== this.usuario().senha) {
      return { senhaIncorreta: true };
    }
    return null;
  }
    */

  // Valida a força da nova senha
  validarForcaSenha(control: AbstractControl): { [key: string]: boolean } | null {
    const senha = control.value;
    if (!senha) return null;

    const senhaFraca = senha.length < 6;
    const senhaMedia = senha.length >= 6 && senha.length < 10;
    const senhaForte = senha.length >= 10;

    if (senhaFraca) {
      return { senhaFraca: true };
    } else if (senhaMedia) {
      return { senhaMedia: true };
    } else if (senhaForte) {
      return null; // Senha forte, tudo certo
    }

    return null;
  }

  // Verifica se a confirmação de senha é igual à nova senha
  validarConfirmacaoSenha(control: AbstractControl): { [key: string]: boolean } | null {
    const confirmarSenha = control.value;
    const novaSenha = this.senhaForm?.get('novaSenha')?.value;

    if (confirmarSenha !== novaSenha) {
      return { confirmacaoInvalida: true };
    }
    return null;
  }

  // Função genérica para exibir erros personalizados de qualquer campo e validação
  getErroCampo(campo: string): string | null {
    const control = this.senhaForm.get(campo);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo é obrigatório';
      }
      if (control.errors?.['senhaIncorreta']) {
        return 'A senha atual está incorreta';
      }
      if (control.errors?.['senhaFraca']) {
        return 'A senha é muito fraca. Deve ter pelo menos 6 caracteres.';
      }
      if (control.errors?.['senhaMedia']) {
        return 'A senha é média. Deve ter mais de 10 caracteres para ser forte.';
      }
      if (control.errors?.['confirmacaoInvalida']) {
        return 'A confirmação da senha não coincide com a nova senha.';
      }
    }
    return null;
  }

  // Submeter nova senha se tudo estiver válido
  redefinirSenha() {
    if (this.senhaForm.valid) {
      const { senhaAtual, novaSenha, confirmarSenha } = this.senhaForm.value;
      console.log('Senha redefinida com sucesso:', { senhaAtual, novaSenha, confirmarSenha });
    } else {
      alert('Por favor, corrija os erros antes de submeter.');
    }
  }
}