import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  cargando = false;
  error = '';

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  login(): void {
    this.error = '';
    this.cargando = true;

    this.auth.login({ usuario: this.usuario, contrasena: this.contrasena }).subscribe({
      next: () => void this.router.navigate(['/productos']),
      error: () => {
        this.error = 'No se pudo iniciar sesión. Revisa tus datos y que la API esté activa.';
        this.cargando = false;
      }
    });
  }
}
