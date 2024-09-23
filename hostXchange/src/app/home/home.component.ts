import { Component } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
