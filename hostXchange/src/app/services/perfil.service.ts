import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

//isso aqui só existe para simular o backend
export interface Usuario {
  idusuario: string;
  nome: string;
  username: string;
  rg: string;
  cpf: string;
  senha: string;
  nrpassa: string;
  fotoPerfil: string;
  fotoCapa: string;
  redesSociais: { nome: string, url: string }[]
}


@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:3000/usuario'; // url backend

  //Avaliacao: { id: string, idAvaliado: string, idAvaliador: string, nomeAvaliador: string, nota: number, comentario: string, data: Date }[] = [];
  //AvaliacaoPendente: { idAvaliar: string; nomeUsuario: string }[] = [];

  //isso aqui também só existe para simular o backend
  private mockUsuario: Usuario = {
    idusuario: '1',
    nome: 'João Silva',
    username: 'joaosilva',
    rg: '12.345.678-9',
    cpf: '123.456.789.00',
    senha: '123456',
    nrpassa: 'AB123456',
    fotoCapa: 'assets/images/perfil/capa.jpg',
    fotoPerfil: 'assets/images/perfil/perfil.jpg',
    redesSociais: [
      { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/joaosilva' },
      { nome: 'Twitter', url: 'https://www.twitter.com/joaosilva' },
      { nome: 'Instagram', url: 'https://www.instagram.com/joaosilva' },
      { nome: 'Facebook', url: 'https://www.facebook.com/joaosilva' },
    ]
  };

  constructor(private http: HttpClient) { }

  Avaliacao = [
    {
      idAvaliacao: '1',
      avaliadoId: '1',
      avaliadoNome: 'Larissa',
      avaliadorId: '2',
      nomeAvaliador: 'Maria',
      avaliacao: 4,
      descricao: 'Muito bom',
      snaval: true,
      data: new Date()
    },
    {
      idAvaliacao: '2',
      avaliadoId: '1',
      avaliadoNome: 'Maria',
      avaliadorId: '3',
      nomeAvaliador: 'José',
      avaliacao: 2,
      descricao: 'Ruim',
      snaval: true,
      data: new Date(new Date().setDate(new Date().getDate() - 1))
    },
    {
      idAvaliacao: '3',
      avaliadoId: '1',
      avaliadoNome: 'Joaquim',
      avaliadorId: '4',
      nomeAvaliador: 'Ana',
      avaliacao: 5,
      descricao: 'Excelente',
      snaval: true,
      data: new Date(new Date().setDate(new Date().getDate() + 50))
    }
  ];

  AvaliacaoPendente = [
    {
      idAvaliar: '1',
      nomeUsuario: 'João'
    },
    {
      idAvaliar: '2',
      nomeUsuario: 'Maria'
    },
    {
      idAvaliar: '3',
      nomeUsuario: 'José'
    }
  ];

  salvarAvaliacao(avaliacao: { idAvaliacao: string, avaliadoId: string, avaliadoNome: string, avaliadorId: string, nomeAvaliador: string, avaliacao: number, descricao: string, snaval: boolean, data: Date }): Observable<any> {
    this.Avaliacao.push(avaliacao);
    return of(avaliacao);
  }

  getAvaliacoes(): Observable<{ avaliacoes: any[], avaliacoesPendentes: any[] }> {
    return of({ avaliacoes: this.Avaliacao, avaliacoesPendentes: this.AvaliacaoPendente });
  }

  getUsuarioMock(): Observable<Usuario> {
    return of(this.mockUsuario)
  }

  atualizarUsuarioMock(dadosAtualizados: Partial<Usuario>) {
    this.mockUsuario = { ...this.mockUsuario, ...dadosAtualizados };
    return of(this.mockUsuario);
  }

  atualizarSenha(novaSenha: string): Observable<boolean> {
    this.mockUsuario.senha = novaSenha;
    return of(true);
  }

  getUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}`);
  }

  atualizarUsuario(dadosAtualizados: Partial<Usuario>, fotoCapa?: File, fotoPerfil?: File): Observable<Usuario> {
    const formData = new FormData();

    Object.keys(dadosAtualizados).forEach(key => {
      formData.append(key, (dadosAtualizados as any)[key]);
    });

    if (fotoPerfil) {
      formData.append('fotoPerfil', fotoPerfil);
    }
    if (fotoCapa) {
      formData.append('fotoCapa', fotoCapa);
    }

    return this.http.put<Usuario>(`${this.apiUrl}`, formData);
  }

}