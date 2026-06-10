import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardItem {
  id: string;
  name: string;
  status: string;
  date: string;
  value: number;
  deleted?: boolean;
}

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items-list.html',
  styleUrls: ['./items-list.scss']
})
export class ItemsListComponent {

  @Input() items: DashboardItem[] = [];
  @Output() deleteItem = new EventEmitter<string>();

}