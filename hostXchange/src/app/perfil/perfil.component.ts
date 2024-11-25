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

  usuario: Usuario | null = null;
  usuarioEditando: Usuario | null = null;
  editMode = false;
  perfilForm!: FormGroup;
  novaRedeForm!: FormGroup;
  fotoPerfilFile?: File;
  fotoCapaFile?: File;
  senhaAtualCorreta: string = '';

  todasRedesSociais: string[] = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'];
  redesSociaisDisponiveis: string[] = [];
  
  passwordVisible: PasswordVisibility = {
    current: false,
    new: false,
    confirm: false
  };

  constructor (private toastr : ToastrService) {
    
  }
  

  ngOnInit(): void {
    this.obterUsuario();
  }

  obterUsuario() {
    this.perfilService.getUsuarioMock().pipe(
      finalize(() => console.log('Finalizado'))
    ).subscribe({
      next: (user) => {
        this.usuario = user;
        this.senhaAtualCorreta = this.usuario.senhaAtual;
        this.usuarioEditando = this.usuario;
        this.initForm();
        this.atualizarRedesSociaisDisponiveis();
      },
      error: (error) => {
        console.error('Erro ao obter usuário:', error);
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
      passaporte: [this.usuario?.passaporte, [Validators.required, Validators.minLength(8)]],
      redesSociais: this.fb.array([]),
      novaRedeSocial: this.fb.group({
        nome: ['', Validators.required],
        url: ['https://', [
          Validators.required,
          Validators.pattern('^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$')
        ]]
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
  }

  hasRedesSociais(): boolean {
    return this.usuario && this.usuario.redesSociais ? this.usuario.redesSociais.length > 0 : false;
  }

  setRedesSociais() {
    if (this.usuario?.redesSociais) {
      this.usuario.redesSociais.forEach((rede: RedeSocial) => {
        this.redesSociais.push(
          this.fb.group({
            nome: [rede.nome, Validators.required],
            url: [rede.url, [
              Validators.required,
              Validators.pattern('^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$')
            ]]
          })
        );
      });
      this.atualizarRedesSociaisDisponiveis();
    }
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
        nome: [novaRede.nome, Validators.required],
        url: [novaRede.url, [
          Validators.required,
          Validators.pattern('^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$')
        ]]
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
    console.log(this.usuario?.redesSociais);
    console.log(this.redesSociaisDisponiveis);
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
        const maxWidth = 800;
        const maxHeight = 800;
        
        if (img.width > maxWidth || img.height > maxHeight) {
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
          console.error('Todos os campos de senha são necessários');
          return;
        }

        if (this.perfilForm.hasError('passwordMismatch')) {
          console.error('As senhas não coincidem');
          return;
        }

        // Atualizar senha primeiro
        this.perfilService.atualizarSenha(
          formValue.novaSenha
        ).pipe(
          catchError(error => {
            console.error('Erro ao alterar senha:', error);
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
        console.error('Erro ao atualizar perfil:', error);
        return throwError(() => error);
      })
    ).subscribe(() => {
      console.log('Perfil atualizado com sucesso');
      this.toggleEditMode();
    });
  }

  toggleEditMode() {
    if (this.editMode && this.perfilForm.dirty) {
      if (confirm('Existem alterações não salvas. Deseja realmente cancelar?')) {
        this.editMode = false;
        this.perfilForm.reset();
        this.initForm();
      }
    } else {
      this.editMode = !this.editMode;
    }
  }


}