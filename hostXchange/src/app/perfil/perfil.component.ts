import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService, Usuario } from '../services/perfil.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';


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
  editMode = false;
  perfilForm!: FormGroup;
  novaRedeForm!: FormGroup;
  fotoPerfilFile?: File;
  fotoCapaFile?: File;
  passwordVisible = {current: false, new: false, confirm: false};

  availableSocials = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'github', label: 'GitHub' },
    { value: 'instagram', label: 'Instagram' },
  ];
  

  ngOnInit(): void {
    this.obterUsuario();
  }

  obterUsuario() {
    this.perfilService.getUsuarioMock().subscribe(user => {
      this.usuario = user;
      this.initForm();
    });
  }

  initForm() {
    this.perfilForm = this.fb.group({
      nome: [this.usuario?.nome || '', Validators.required],
      username: [this.usuario?.username || '', Validators.required],
      rg: [this.usuario?.rg || '', Validators.required],
      cpf: [this.usuario?.cpf || '', Validators.required],
      passaporte: [this.usuario?.passaporte || '', Validators.required]
    });

    this.novaRedeForm = this.fb.group({
      nome: ['', Validators.required],
      url: ['https://', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }


  get redesSociais(): FormArray {
    return this.perfilForm.get('redesSociais') as FormArray;
  }


  isSocialMediaDuplicate(nome: string): boolean {
    return this.redesSociais.controls.some((control) => control.get('nome')?.value === nome);
  }

  addSocialMedia() {
    const nome = this.novaRedeForm.get('nome')?.value;
    const url = this.novaRedeForm.get('url')?.value;
    if (this.usuario && nome && url) {
      this.usuario.redesSociais.push({ nome, url });
      this.novaRedeForm.reset({ nome: '', url: 'https://' });
    }
  }

  removeSocialMedia(index: number) {
    this.usuario?.redesSociais.splice(index, 1);
  }

  togglePasswordVisibility (passwordField: 'current' | 'new' | 'confirm') {
    this.passwordVisible[passwordField] = !this.passwordVisible[passwordField];
  }

  onFileSelected(event: Event, tipo: 'perfil' | 'capa') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (tipo === 'perfil') {
        this.fotoPerfilFile = file;
        this.perfilForm.patchValue({ fotoPerfil: file });
      } else {
        this.fotoCapaFile = file;
        this.perfilForm.patchValue({ fotoCapa: file });
      }
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  salvarAlteracoes() {
    if (this.perfilForm.valid && this.usuario) {
      const dadosAtualizados: Partial<Usuario> = this.perfilForm.value;

      this.perfilService.atualizarUsuarioMock(dadosAtualizados); // Mock para atualização
      // Para uso real:
      // this.perfilService.atualizarUsuario(dadosAtualizados, this.fotoPerfilFile, this.fotoCapaFile).subscribe();

      this.toggleEditMode();
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }


}