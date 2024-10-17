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

  public logado:any = false;

  constructor(private router: Router) {}

  ngOnInit() {
    localStorage.getItem("logado") ? this.logado = localStorage.getItem("logado") : this.logado = false;
  }

  login(){
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('nome');
    localStorage.removeItem('logado');
    this.router.navigate(['/home']);
  }

}
