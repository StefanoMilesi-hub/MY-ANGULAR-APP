import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { UserComponent } from './user';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent, UserComponent],
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