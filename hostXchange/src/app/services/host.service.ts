import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private http: HttpClient) { }

  enviarFormulario (formHostData: Object){
    return this.http.post('http://localhost:3000/cadastro/tornaHost', formHostData);
  }
}
