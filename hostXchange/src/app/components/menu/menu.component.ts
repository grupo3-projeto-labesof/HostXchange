import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent {

  public logado:boolean = localStorage.getItem("logado") === "true" ? true : false;
  public tipo_user      = localStorage.getItem("tipo_user");

  constructor(private router: Router) { }

  ngOnInit() { }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('nome');
    localStorage.removeItem('logado');
    localStorage.removeItem('tipo_user');
    localStorage.removeItem('idHost');
    localStorage.removeItem('verPerfil');
    localStorage.removeItem('verIntercambio');
    this.router.navigate(['/login']);
  }

}
