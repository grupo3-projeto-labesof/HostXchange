import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: any): boolean {
    const tipoUser = localStorage.getItem('tipo_user');
    const idIntercambio = localStorage.getItem('idIntercambio');

    if (route.routeConfig?.path === 'tornar-host' && tipoUser === 'V') {
      return true; // Acesso permitido para "tornar-host"
    }

    if (
      route.routeConfig?.path === 'cadastrar-intercambio' &&
      tipoUser === 'H' &&
      idIntercambio === '0'
    ) {
      return true; // Acesso permitido para "cadastrar-intercambio"
    }

    this.router.navigate(['/home']); // Redireciona para home caso o acesso seja negado
    return false;
  }
}
