import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  isScrolled = false;
  scrollProgress = 0;

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const start = 12;
    const distance = 150;
    const rawProgress = (window.scrollY - start) / distance;

    this.scrollProgress = Math.min(Math.max(rawProgress, 0), 1);
    this.isScrolled = this.scrollProgress > 0.04;
  }

  navigateToContacto(): void {
    this.router.navigate(['/contacto']);
  }

  navigateToServicios(): void {
    this.router.navigate(['/servicios']);
  }
}
