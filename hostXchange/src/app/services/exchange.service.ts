import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExchangeService {
    private apiUrl = 'http://localhost:3000/';

    constructor(private http: HttpClient) { }

    cadastrarIntercambio (dados: Object) {
        return this.http.post(`${this.apiUrl}intercambios/cadastrar`, dados);
    }
    
    buscarIntercambios(): Observable<any> {
        return this.http.get(`${this.apiUrl}intercambios/buscar`);
    }
    
    getExchangeById(id:any) {
        return this.http.post(`${this.apiUrl}intercambios/buscarIntercambio`, id);
    }
    
    seCandidatar(data: Object) {
        return this.http.post(`${this.apiUrl}match/criarMatch`, data);
    }
}
