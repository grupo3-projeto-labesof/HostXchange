import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { PerfilService } from '../services/perfil.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pesquisar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent, FooterComponent],
  templateUrl: './pesquisar-usuario.component.html',
  styleUrl: './pesquisar-usuario.component.css'
})

export class PesquisarUsuarioComponent implements OnInit {
  formularioPesquisa: FormGroup;
  resultados: any[] = [];
  usuarios  : any[] = [];
  pesquisado: boolean = false;
  argumento : string = '';

  constructor(private fb: FormBuilder, private service: PerfilService, private toastr: ToastrService, private router: Router) {
    this.formularioPesquisa = this.fb.group({
      nomePesquisado: ['']
    });
  }

  ngOnInit(): void {
    this.service.getTodosPerfis().subscribe({
      next: async (res: any) => {
        if(res.blOk === true) {
          this.usuarios = res.dados;
          this.resultados = this.usuarios.map(u => { 
            return {
                id  : u.idusuario
              , nome: u.nome 
            };
          });
        }
      },
      error: (error) => {
        console.error('Error during getPerfis:', error);
        this.toastr.warning('Ocorreu um erro durante o carregamento da tela. Por favor, recarregue a página!', 'ATENÇÃO:');
      }
    });
  }

  get hasResultados(): boolean {
    return this.resultados.length > 0;
  }

  Pesquisar(): void {
    this.argumento = this.formularioPesquisa.get('nomePesquisado')?.value;
    this.pesquisado = true;
    const pesquisa = this.formularioPesquisa.get('nomePesquisado')?.value;
    if (pesquisa && pesquisa != "") {
      this.resultados = this.buscaPerfil(pesquisa);
    } else if(pesquisa === "") {
      this.resultados = this.usuarios.map(u => { 
        return {
            id  : u.idusuario
          , nome: u.nome 
        };
      });
    }
  }

  buscaPerfil(idUsuario: string): any[] {
    //função que simula a busca de usuários no backend
    //função que busca baseando no id do usuario e retorna o nome e o link para o perfil
    //link para o perfil é a rota perfil + o id do usuario encontrado
    //OBS: apenas imaginando que seja assim que será a busca

    const usuarios = this.usuarios.map(u => { 
      return {
          id  : u.idusuario
        , nome: u.nome 
      };
    });

    return usuarios.filter(usuario => usuario.nome.toLowerCase().includes(idUsuario.toLowerCase()));
  }

  perfil(id:any) {
    this.resultados
    localStorage.setItem("verPerfil", id);
    this.router.navigate(["/perfil"]);
  }
}