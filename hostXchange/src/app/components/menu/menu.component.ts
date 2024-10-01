import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  public logado:any = false;

  constructor(private router: Router) {}

  ngOnInit() {
    debugger
    localStorage.getItem("logado") ? this.logado = localStorage.getItem("logado") : this.logado = false;
  }

  login(){
    this.router.navigate(['/login']);
  }

}
