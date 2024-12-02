import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private apiUrl = 'http://localhost:3000/';

    constructor(private http: HttpClient) {}

    getIntercambios(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}mapa/listar`, {});
    }
}