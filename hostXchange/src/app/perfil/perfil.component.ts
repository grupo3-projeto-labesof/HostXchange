import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PerfilService, Usuario } from '../services/perfil.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { catchError, finalize, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


interface RedeSocial {
  nome: string;
  url: string;
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgxMaskDirective, CommonModule, ReactiveFormsModule, MenuComponent, FooterComponent],
  providers: [provideNgxMask(), PerfilService],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})

export class PerfilComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private fb = inject(FormBuilder);

  //isso aqui só existe para simular o backend
  usuarioLogado: Usuario = {
    idusuario: '1',
    nome: 'Jax',
    username: 'jaxtoplaner',
    rg: '54.921.572-9',
    cpf: '493.216.345.44',
    senha: '995501',
    nrpassa: 'AB12496',
    fotoCapa: 'assets/images/perfil/capa.jpg',
    fotoPerfil: 'assets/images/perfil/perfil.jpg',
    redesSociais: [
      { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/jaxtoplaner' },
      { nome: 'Twitter', url: 'https://www.twitter.com/jaxtoplaner' },
    ]
  };

  //isso aqui deve ser mudado para o tipo que for recebido na service, provavel any(?)
  usuario: Usuario | null = null;
  usuarioEditando: Usuario | null = null;
  editMode = false;
  perfilForm!: FormGroup;
  avaliacaoForm!: FormGroup;
  novaRedeForm!: FormGroup;
  fotoPerfilFile?: File;
  fotoCapaFile?: File;
  senhaAtualCorreta: string = '';
  notaAvaliacaoUsuario: number = 4.7;
  notaAvaliacao: number = 0;
  comentarioAvaliacao: string = '';
  mostrarAvaliacoes = false;
  avaliarUsuario = false;
  

  todasRedesSociais: string[] = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'];
  redesSociaisDisponiveis: string[] = [];

  Avaliacao: any[] = [];
  AvaliacaoPendente: any[] = [];
  avaliacaoPendenteEspecifica: any;

  passwordVisible: PasswordVisibility = {
    current: false,
    new: false,
    confirm: false
  };

  constructor(private toastr: ToastrService) {

  }


  ngOnInit(): void {
    this.obterUsuario();
    this.initForm();
  }

  obterUsuario() {
    this.perfilService.getUsuarioMock().pipe(
      finalize(() => console.log('Finalizado'))
    ).subscribe({
      next: (user) => {
        this.usuario = user;
        this.senhaAtualCorreta = this.usuario.senha;
        this.usuarioEditando = this.usuario;
        this.initForm();
        this.atualizarRedesSociaisDisponiveis();
      },
      error: (error) => {
        this.toastr.error('Erro ao obter usuário: ', error);
        // Implementar notificação de erro
      }
    });

    this.perfilService.getAvaliacoes().pipe(
      finalize(() => console.log('Finalizado'))
    ).subscribe({
      next: (avaliacoes) => {
        this.Avaliacao = avaliacoes.avaliacoes;
        this.AvaliacaoPendente = avaliacoes.avaliacoesPendentes;
      },
      error: (error) => {
        this.toastr.error('Erro ao obter avaliações: ', error);
        // Implementar notificação de erro
      }
    });
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
      username: [this.usuario?.username, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      rg: [this.usuario?.rg, [Validators.required, Validators.minLength(7)]],
      cpf: [this.usuario?.cpf, [Validators.required, Validators.minLength(11)]],
      passaporte: [this.usuario?.nrpassa, [Validators.required, Validators.minLength(8)]],
      redesSociais: this.fb.array([]),
      novaRedeSocial: this.fb.group({
        nome: [null],
        url: ['https://']
      }),
      senhaAtual: ['', Validators.minLength(6)],
      novaSenha: ['', [
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      confirmarNovaSenha: ['']
    }, {
      validators: [this.passwordRequiredValidator.bind(this), this.passwordMatchValidator]
    });

    this.setRedesSociais();

    this.avaliacaoForm = this.fb.group({
      avaliacao: [null, Validators.required],
      descricao: ['', Validators.maxLength(200)]
    });
  }

  salvarAvaliacao() {
    if (this.avaliacaoForm.valid) {
      const avaliacao = this.avaliacaoForm.value;
      this.perfilService.salvarAvaliacao(avaliacao).pipe(
        finalize(() => console.log('Avaliação salva')),
        catchError(error => {
          this.toastr.error('Erro ao salvar avaliação. Tente novamente mais tarde.');
          return throwError(() => error);
        })
      ).subscribe(() => {
        this.toastr.success('Avaliação salva com sucesso');
        this.avaliarUsuario = false;
        this.avaliacaoForm.reset();
        this.obterUsuario();
      });
    }
  }

  acaoAvaliarUsuario(idAvaliacao: string) {
    this.avaliarUsuario = !this.avaliarUsuario;
    this.avaliacaoPendenteEspecifica = this.AvaliacaoPendente.find(avaliacao => avaliacao.idAvaliar === idAvaliacao);
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
    this.avaliarUsuario = false;
    this.avaliacaoPendenteEspecifica = null;
  }

  hasRedesSociais(): boolean {
    return this.usuario && this.usuario.redesSociais ? this.usuario.redesSociais.length > 0 : false;
  }

  setRedesSociais() {
    const formArray = this.perfilForm.get('redesSociais') as FormArray;

    if (this.usuario?.redesSociais?.length) {
      this.usuario.redesSociais.forEach((rede: RedeSocial) => {
        formArray.push(
          this.fb.group({
            nome: [rede.nome],
            url: [rede.url]
          })
        );
      });
    }
    this.atualizarRedesSociaisDisponiveis();
  }

  temAvaliacao(): boolean {
    return this.Avaliacao.length > 0;
  }

  temAvaliacaoPendente(): boolean {
    return this.AvaliacaoPendente.length > 0;
  }

  get redesSociais(): FormArray {
    return this.perfilForm.get('redesSociais') as FormArray;
  }

  get novaRedeSocial(): FormGroup {
    return this.perfilForm.get('novaRedeSocial') as FormGroup;
  }

  addRedeSocial() {
    if (this.novaRedeSocial.valid) {
      const novaRede = {
        nome: this.novaRedeSocial.get('nome')?.value,
        url: this.novaRedeSocial.get('url')?.value
      };

      // Add to form array
      const novaRedeGroup = this.fb.group({
        nome: [novaRede.nome],
        url: [novaRede.url]
      });
      this.redesSociais.push(novaRedeGroup);

      // Add to usuarioEditando
      if (this.usuarioEditando) {
        if (!this.usuarioEditando.redesSociais) {
          this.usuarioEditando.redesSociais = [];
        }
        this.usuarioEditando.redesSociais.push(novaRede);
      }


      this.novaRedeSocial.reset({ url: 'https://' });
      this.atualizarRedesSociaisDisponiveis();
    }
  }

  removeSocialMedia(index: number) {
    this.usuario?.redesSociais.splice(index, 1);
    this.redesSociais.removeAt(index);
    this.atualizarRedesSociaisDisponiveis();

    /*
    console.log(this.usuario?.redesSociais);
    console.log(this.redesSociaisDisponiveis);
    */
  }

  atualizarRedesSociaisDisponiveis() {
    const redesCadastradas = this.usuario?.redesSociais?.map(rede => rede.nome) || [];
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

      // Verify file type
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Por favor, selecione apenas arquivos de imagem.');
        input.value = '';
        return;
      }

      // Verify file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.toastr.error('A imagem deve ter no máximo 5MB.');
        input.value = '';
        return;
      }

      // Verify image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const maxWidth = 2048;
        const maxHeight = 2048;

        if (tipo === 'perfil' && img.width > maxWidth || img.height > maxHeight) {
          this.toastr.error(`A imagem deve ter no máximo ${maxWidth}x${maxHeight} pixels.`);
          input.value = '';
          URL.revokeObjectURL(img.src);
          return;
        }

        // If all validations pass, update the form
        if (tipo === 'perfil') {
          this.fotoPerfilFile = file;
          this.perfilForm.patchValue({ fotoPerfil: file });
        } else {
          this.fotoCapaFile = file;
          this.perfilForm.patchValue({ fotoCapa: file });
        }
        URL.revokeObjectURL(img.src);
      };
    }
  }

  getFotoPreviewUrl(file: File | undefined): string {
    if (file) {
      return URL.createObjectURL(file);
    }
    return '';
  }

  // Modifique o método removerFoto existente para:
  removerFoto(tipo: 'perfil' | 'capa') {
    if (tipo === 'perfil') {
      if (this.fotoPerfilFile) {
        URL.revokeObjectURL(this.getFotoPreviewUrl(this.fotoPerfilFile));
        this.fotoPerfilFile = undefined;
        this.perfilForm.patchValue({ fotoPerfil: '' });
      }
    } else {
      if (this.fotoCapaFile) {
        URL.revokeObjectURL(this.getFotoPreviewUrl(this.fotoCapaFile));
        this.fotoCapaFile = undefined;
        this.perfilForm.patchValue({ fotoCapa: '' });
      }
    }
    this.toastr.success(`Foto de ${tipo} removida com sucesso.`);
  }

  salvarAlteracoes() {
    if (this.perfilForm.valid) {
      const formValue = this.perfilForm.value;

      // Remover subformulário de nova rede social dos dados
      const { novaRedeSocial, ...dadosAtualizados } = formValue;

      // Verificar alteração de senha
      if (formValue.senhaAtual || formValue.novaSenha || formValue.confirmarNovaSenha) {
        if (this.perfilForm.hasError('passwordFieldsRequired')) {
          this.toastr.warning('Todos os campos de senha são necessários');
          return;
        }

        if (this.perfilForm.hasError('passwordMismatch')) {
          this.toastr.warning('As senhas não coincidem');
          return;
        }

        // Atualizar senha primeiro
        this.perfilService.atualizarSenha(
          formValue.novaSenha
        ).pipe(
          catchError(error => {
            this.toastr.warning('Erro ao alterar senha: ', error);
            return throwError(() => error);
          })
        ).subscribe({
          next: () => this.atualizarPerfil(dadosAtualizados),
          error: () => this.toastr.error('Erro ao atualizar senha. Tente novamente mais tarde.')
        });
      } else {
        this.atualizarPerfil(dadosAtualizados);
      }
    }
  }

  private atualizarPerfil(dadosAtualizados: Partial<Usuario>) {
    this.perfilService.atualizarUsuarioMock(dadosAtualizados).pipe(
      finalize(() => console.log('Finalizado')),
      catchError(error => {
        this.toastr.error('Erro ao atualizar perfil. Tente novamente mais tarde.');
        return throwError(() => error);
      })
    ).subscribe(() => {
      this.toastr.success('Perfil atualizado com sucesso');
      this.editMode = false;
    });
  }

  cancelarAlteracoes() {
    if (this.perfilForm.dirty) {
      if (!confirm('Existem alterações não salvas. Deseja realmente cancelar?')) {
        return;
      }
    }
    this.editMode = false;
    this.perfilForm.reset();
    this.initForm();
    this.fotoPerfilFile = undefined;
    this.fotoCapaFile = undefined;
  }



}