import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:3000/'; // url backend

  constructor(private http: HttpClient) { }

  getInformacoes(id: Object) {
    return this.http.post(`${this.apiUrl}perfil/listaPerfil`, id);
  }
  
  getAvaliacoes(id: Object) {
    return this.http.post(`${this.apiUrl}avaliacao/listaAvaliacoes`, id);
  }
  
  salvarAvaliacao(avaliacao: Object) {
    return this.http.post(`${this.apiUrl}avaliacao/atualizaAvaliacao`, avaliacao);
  }

  atualizarPerfil(perfil: Object) {
    return this.http.post(`${this.apiUrl}perfil/atualizarPerfil`, perfil);
  }

  getTodosPerfis() {
    return this.http.get(`${this.apiUrl}perfil/listaPerfis`);
  }

}