import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {

  @Output() registerSuccess = new EventEmitter<string>();
  @Output() switchToLogin = new EventEmitter<void>();

  form = this.createForm();

  constructor(private fb: FormBuilder) {}

  private createForm() {
    return this.fb.group({
      email: [''],
      password: ['']
    });
  }

  register() {
    const { email } = this.form.value;

    if (!email) return;

    console.log('✅ Registrazione:', email);
    this.registerSuccess.emit(email);
  }
}
``