import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
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

  @Output() deleteStat = new EventEmitter<string>();

}
