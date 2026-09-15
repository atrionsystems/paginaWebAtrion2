import { Component } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  selected = 'Automatización';
  created = false;
  message = '';
  answered = false;
  private revealObserver?: IntersectionObserver;

  ngAfterViewInit() {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    revealElements.forEach((element) => element.classList.add('reveal-ready'));

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );

    revealElements.forEach((element) => this.revealObserver?.observe(element));
  }

  ngOnDestroy() {
    this.revealObserver?.disconnect();
  }

  selectRequest(value: string) {
    this.selected = value;
    this.created = true;
  }
  send(event: Event) {
    event.preventDefault();
    if (this.message.trim()) {
      this.answered = true;
      this.message = '';
    }
  }
}
