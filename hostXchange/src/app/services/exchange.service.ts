import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ExchangeService {
    private apiUrl = 'http://localhost:3000/'; // Coloque a URL da sua API aqui

    constructor(private http: HttpClient) { }

    // cadastrarIntercambio(dados: any): Observable<any> {
    //     return this.http.post<any>(`${this.apiUrl}intercambios/cadastrar`, dados);
    // }

    cadastrarIntercambio (dados: Object){
        return this.http.post(`${this.apiUrl}intercambios/cadastrar`, dados);
      }

    // private handleError(error: HttpErrorResponse): Observable<never> {
    //     let errorMessage = 'Erro desconhecido!';
    //     if (error.error instanceof ErrorEvent) {
    //         errorMessage = `Erro: ${error.error.message}`;
    //     } else {
    //         errorMessage = `Erro ${error.status}: ${error.message}`;
    //     }
    //     return throwError(errorMessage);
    // }
}
