import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Usuario {
  nome: string;
  username: string;
  rg: string;
  cpf: string;
  senhaAtual: string;
  passaporte: string;
  fotoPerfil: string;
  fotoCapa: string;
  redesSociais: { nome: string, url: string}[]
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:3000/usuario'; // url backend

  private mockUsuario: Usuario = {
    nome: 'João Silva',
    username: 'joaosilva',
    rg: '12.345.678-9',
    cpf: '123.456.789.00',
    senhaAtual: '123456',
    passaporte: 'AB123456',
    fotoCapa: 'assets/images/perfil/capa.jpg',
    fotoPerfil: 'assets/images/perfil/perfil.jpg',
    redesSociais: [
      {nome: 'LinkedIn', url: 'https://www.linkedin.com/in/joaosilva'},
      {nome: 'Twitter', url: 'https://www.twitter.com/joaosilva'},
      {nome: 'Instagram', url: 'https://www.instagram.com/joaosilva'},
      {nome: 'Facebook', url: 'https://www.facebook.com/joaosilva'},
    ]
  };

  constructor(private http: HttpClient) {}

  getUsuarioMock(): Observable<Usuario> {
    return of(this.mockUsuario)
  }

  atualizarUsuarioMock(dadosAtualizados: Partial<Usuario>) {
    this.mockUsuario = { ...this.mockUsuario, ...dadosAtualizados };
    return of(this.mockUsuario);
  }

  atualizarSenha (novaSenha: string): Observable<boolean> {
    this.mockUsuario.senhaAtual = novaSenha;
    return of(true);
  }

  getUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}`);
  }

  atualizarUsuario(dadosAtualizados: Partial<Usuario>, fotoCapa?:File, fotoPerfil?:File): Observable<Usuario> {
    const formData = new FormData();

    Object.keys(dadosAtualizados).forEach(key => {
      formData.append(key, (dadosAtualizados as any)[key]);
    });

    if(fotoPerfil) {
      formData.append('fotoPerfil', fotoPerfil);
    }
    if(fotoCapa) {
      formData.append('fotoCapa', fotoCapa);
    }

    return this.http.put<Usuario>(`${this.apiUrl}`, formData);
  }

}