import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'] 
})
export class LoginComponent {

  @Output() loginSuccess = new EventEmitter<string>();
  @Output() switchToRegister = new EventEmitter<void>();

  email = '';

  login() {
    this.loginSuccess.emit(this.email);
  }
}