import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <input [(ngModel)]="email" placeholder="Email" />
    <button (click)="login()">Login</button>
    <p (click)="switchToRegister.emit()">Registrati</p>
  `
})
export class LoginComponent {

  @Output() loginSuccess = new EventEmitter<string>();
  @Output() switchToRegister = new EventEmitter<void>();

  email = '';

  login() {
    this.loginSuccess.emit(this.email);
  }
}