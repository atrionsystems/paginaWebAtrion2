import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ContactoComponent } from './pages/contacto/contacto';
import { Servicios } from './pages/servicios/servicios';
import { Asesorias } from './pages/asesorias/asesoria';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contacto', component: ContactoComponent },
  { path: 'servicios', component: Servicios },
  { path: 'asesorias', component: Asesorias },
  { path: '**', redirectTo: '' }
];