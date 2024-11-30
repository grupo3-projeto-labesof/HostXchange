import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
  public verPerfil : any = 0;//Number(localStorage.getItem("verPerfil"));

  public avaliacoesPendentes:any = [];
  public avaliacoesRecebidas:any = [];
  public avaliacoesFeitas   :any = [];

  public usuario:any = {};

  public view = 1;

  public notaAvaliacaoUsuario: number = 0;
  public redesSociais:Array<any> = [];

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
  // novaRedeForm!: FormGroup;
  fotoPerfilFile?: File;
  fotoCapaFile?: File;
  senhaAtualCorreta: string = '';
  // notaAvaliacaoUsuario: number = 4.7;
  notaAvaliacao: number = 0;
  comentarioAvaliacao: string = '';
  // mostrarAvaliacoes = false;
  avaliacao: any;
  

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
      private toastr : ToastrService
    , private service: PerfilService 
    , private fb     : FormBuilder
  ) { }


  ngOnInit(): void {
    this.informacoes();
    this.initForm();
  }
  
  async informacoes() {
    const perfil = this.verPerfil != 0 ? this.verPerfil : this.userLogado;
    this.usuario             = [];
    this.avaliacoesFeitas    = [];
    this.avaliacoesPendentes = [];
    this.avaliacoesRecebidas = [];
    this.redesSociais        = [];
    await this.service.getInformacoes({idUser: perfil}).subscribe({
      next: async (res: any) => {
        if (res.blOk === true) {
          this.usuario = res.dados;
          const { facebook, instagram, twitter, linkedin, fotoCapa, fotoPerfil } = res.dados;
          if(facebook)  this.redesSociais.push({ nome: "Facebook" , url: facebook  });
          if(instagram) this.redesSociais.push({ nome: "Instagram", url: instagram });
          if(twitter)   this.redesSociais.push({ nome: "Twitter"  , url: twitter   });
          if(linkedin)  this.redesSociais.push({ nome: "LinkedIn" , url: linkedin  });
          this.atualizarRedesSociaisDisponiveis()

          if(fotoCapa === null || "") this.usuario.fotoCapa = 'assets/images/perfil/capa.jpg';
          if(fotoPerfil === null || "") this.usuario.fotoPerfil = 'assets/images/perfil/perfil.jpg';

          await this.service.getAvaliacoes({idUser: perfil}).subscribe({
            next: (res: any) => {
              if (res.blOk === true) {
                const avaliacoes = res.avaliacoes;
                if(this.verPerfil) {
                  avaliacoes.avaliado.map((b:any) => b.snaval === true ? this.avaliacoesRecebidas.push(b) : null );
                  this.notaAvaliacaoUsuario = avaliacoes.media;
                } else {
                  avaliacoes.avaliado.map((b:any) => b.snaval === true ? this.avaliacoesRecebidas.push(b) : null );
                  avaliacoes.avaliador.map((b:any) =>  b.snaval === true ? this.avaliacoesFeitas.push(b) : b.snaval === false ? this.avaliacoesPendentes.push(b) : null );
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
        , avaliacao  : this.avaliacaoForm.value.avaliacao
        , descricao  : this.avaliacaoForm.value.descricao 
      };
      
      await this.service.salvarAvaliacao(avaliacao).subscribe({
        next: (res: any) => {
          debugger
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
    debugger
    this.avaliacao = idAvaliacao;
    //this.avaliacaoPendenteEspecifica = this.AvaliacaoPendente.find(avaliacao => avaliacao.idAvaliar === idAvaliacao);
    this.view = 4;
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
    debugger
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
      this.redesSociais.push(novaRedeGroup.value);

      // Add to usuarioEditando
      // if (this.usuarioEditando) {
      //   if (!this.usuarioEditando.redesSociais) {
      //     this.usuarioEditando.redesSociais = [];
      //   }
      //   this.usuarioEditando.redesSociais.push(novaRede);
      // }


      this.novaRedeSocial.reset({ url: 'https://' });
      this.atualizarRedesSociaisDisponiveis();
    }
  }

  removeSocialMedia(index: number) {
    this.redesSociais.splice(index, 1);
    // this.redesSociais.removeAt(index);
    this.atualizarRedesSociaisDisponiveis();

    /*
    console.log(this.usuario?.redesSociais);
    console.log(this.redesSociaisDisponiveis);
    */
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

  async salvarAlteracoes() {
    debugger
    //if (this.perfilForm.valid) {
      const formValue = this.perfilForm.value;
      let data:any = {
          userId    : this.usuario.idusuario
        , nome      : this.perfilForm.value.nome
        , email     : this.perfilForm.value.username
        , cpf       : this.perfilForm.value.cpf
        , rg        : this.perfilForm.value.rg
        , nrpassa   : this.perfilForm.value.passaporte
        , fotoCapa  : this.perfilForm.value.fotoCapa
        , fotoPerfil: this.perfilForm.value.fotoPerfil
      }

      this.redesSociais.map(m => {
        m.nome === "Facebook"  ? data.facebook  = m.url : null;
        m.nome === "Twitter"   ? data.twitter   = m.url : null;
        m.nome === "Instagram" ? data.instagram = m.url : null;
        m.nome === "LinkedIn"  ? data.linkedin  = m.url : null;
      })

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
        data.senha = this.perfilForm.value.novaSenha;
        await this.service.atualizarPerfil(data).subscribe({
          next: (res: any) => {
            debugger
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
      } else {
        await this.service.atualizarPerfil(data).subscribe({
          next: (res: any) => {
            debugger
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
    //}
  }

  cancelarAlteracoes() {
    // if (this.perfilForm.dirty) {
    //   if (!confirm('Existem alterações não salvas. Deseja realmente cancelar?')) {
    //     return;
    //   }
    // }
    // this.editMode = false;
    this.perfilForm.reset();
    this.initForm();
    this.fotoPerfilFile = undefined;
    this.fotoCapaFile = undefined;
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