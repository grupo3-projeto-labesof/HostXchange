import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private usuario = {
    nome: 'João da Silva',
    email: 'joao@example.com',
    telefone: '(11) 1234-5678',
    senha: '123456789011',
    cpf: '123.456.789-10',
    rg: '12.345.678-9',
    passaporte: 'AB123456',
    fotoPerfil: 'assets/images/perfil/perfil.jpg',
    fotoCapa: 'assets/images/perfil/capa.jpg',
    redesSociais: [
      { nome: 'Facebook', link: 'https://facebook.com/joaodasilva' },
      { nome: 'LinkedIn', link: 'https://linkedin.com/in/joaodasilva' }
    ]
  };

  constructor(private http: HttpClient) {}

  // Obtém o perfil do usuário sem a senha
  obterPerfilUsuario(): Observable<any> {
    const { senha, ...perfilSemSenha } = this.usuario;
    return of(perfilSemSenha);
  }

  // Obtém a senha do usuário ao abrir o modal de redefinição de senha
  obterSenhaUsuario(): Observable<string> {
    return of(this.usuario.senha);
  }

  // Simula a redefinição da senha do usuário
  redefinirSenha(senhaAtual: string, novaSenha: string): Observable<any> {
    if (senhaAtual === this.usuario.senha) {
      this.usuario.senha = novaSenha; // Atualiza a senha no "backend"
      return of({ message: 'Senha redefinida com sucesso!' });
    } else {
      return of({ message: 'Erro: Senha atual incorreta' });
    }
  }

  // Simula a atualização do perfil do usuário
  atualizarPerfilUsuario(dadosUsuario: any): Observable<any> {
    this.usuario = { ...this.usuario, ...dadosUsuario }; // Atualiza localmente os dados
    return of({ message: 'Perfil atualizado com sucesso!' });
  }

  // Simula a atualização da senha do usuário
  atualizarSenhaUsuario(senhaAtual: string, novaSenha: string): Observable<any> {
    // Simulação de mudança de senha
    return of({ message: 'Senha alterada com sucesso!' });
  }

  // Simula o envio de uma foto (perfil/capa)
  enviarFoto(arquivo: File): Observable<string> {
    // Simula o upload e o retorno do caminho da foto
    return of('caminho/para/foto.jpg');
  }

  /*
  // Obtém o perfil do usuário
  obterPerfilUsuario(): Observable<any> {
    return this.http.get('/api/perfil/usuario');
  }

  // Atualiza o perfil do usuário
  atualizarPerfilUsuario(dadosUsuario: any): Observable<any> {
    return this.http.put('/api/perfil/usuario', dadosUsuario);
  }

  // Atualiza a senha do usuário
  atualizarSenhaUsuario(senhaAtual: string, novaSenha: string): Observable<any> {
    return this.http.put('/api/perfil/senha', { senhaAtual, novaSenha });
  }

  // Envia a foto de perfil ou de capa
  enviarFoto(arquivo: File): Observable<string> {
    const formData = new FormData();
    formData.append('foto', arquivo);

    return this.http.post<string>('/api/perfil/foto', formData);
  }
    */
}