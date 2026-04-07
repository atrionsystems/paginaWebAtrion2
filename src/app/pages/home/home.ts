import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}