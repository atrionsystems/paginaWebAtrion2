import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}