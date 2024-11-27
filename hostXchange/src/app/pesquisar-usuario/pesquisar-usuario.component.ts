import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';

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
  pesquisado: boolean = false;
  argumento: string = '';

  constructor(private fb: FormBuilder) {
    this.formularioPesquisa = this.fb.group({
      nomePesquisado: ['']
    });
  }

  ngOnInit(): void {}

  get hasResultados(): boolean {
    return this.resultados.length > 0;
  }

  Pesquisar(): void {
    this.argumento = this.formularioPesquisa.get('nomePesquisado')?.value;
    this.pesquisado = true;
    const pesquisa = this.formularioPesquisa.get('nomePesquisado')?.value;
    if (pesquisa) {
      
      this.resultados = this.buscaPerfil(pesquisa);
    }
  }

  buscaPerfil(idUsuario: string): any[] {
    //função que simula a busca de usuários no backend
    //função que busca baseando no id do usuario e retorna o nome e o link para o perfil
    //link para o perfil é a rota perfil + o id do usuario encontrado
    //OBS: apenas imaginando que seja assim que será a busca

    const usuarios = [
      { nome: 'John Doe', linkPerfil: '/perfil/3' },
      { nome: 'Jane Smith', linkPerfil: '/perfil/20' },
      { nome: 'Luis Garcia', linkPerfil: '/perfil/5' },
      { nome: 'Luis Alberto', linkPerfil: '/perfil/7' },
    ];
    return usuarios.filter(usuario => usuario.nome.toLowerCase().includes(idUsuario.toLowerCase()));
  }
}