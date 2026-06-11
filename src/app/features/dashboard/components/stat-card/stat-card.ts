import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.scss']
})
export class StatCardComponent {

  @Input() id!: string;
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() change!: number;
  @Input() icon!: string;
  @Input() color!: string;

  @Output() select = new EventEmitter<string>();
  @Output() deleteStat = new EventEmitter<string>();

  logColor() {
    console.log('CARD COLOR:', this.color);
  }

}
