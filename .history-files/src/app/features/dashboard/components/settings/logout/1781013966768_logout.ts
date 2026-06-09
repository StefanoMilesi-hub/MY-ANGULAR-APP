import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './logout.html',
  styleUrls: ['./logout.scss']
})
export class LogoutComponent {

  @Input() email: string | null = null;
  @Output() logout = new EventEmitter<void>();

}