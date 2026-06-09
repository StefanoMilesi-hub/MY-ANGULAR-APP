import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './settings.html'
})
export class SettingsComponent {

  mode: 'login' | 'register' | 'logged' = 'login';
  userEmail: string | null = null;

  onLogin(email: string) {
    this.userEmail = email;
    this.mode = 'logged';
  }

  onRegister(email: string) {
    this.userEmail = email;
    this.mode = 'logged';
  }

  onLogout() {
    this.userEmail = null;
    this.mode = 'login';
  }
}