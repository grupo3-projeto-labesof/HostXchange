import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  entrar(login: any) {
    return this.http.post('http://localhost:3000/login', login);
  }

  cadastrar(user: any) {
    return this.http.post('http://localhost:3000/cadastrar', user);
  }

  enviarEmail(email:string) {
    return this.http.post('http://localhost:3000/enviarEmail', email);
  }

  confirmarCodigo(codigo:string) {
    return this.http.post('http://localhost:3000/confirmarCodigo', codigo);
  }

  salvarSenha(senha: string) {
    return this.http.post('http://localhost:3000/salvarSenha', senha);
  }
}
