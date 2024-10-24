import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private http: HttpClient) { }

  enviarFormulario (formHostData: any){
    return this.http.post('http://localhost:3000/perfil/enviarFormHost', formHostData);
  }
}
