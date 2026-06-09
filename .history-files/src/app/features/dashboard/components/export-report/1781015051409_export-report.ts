import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { Firebase } from '../../../../services/firebase';

export interface DashboardItem {
  id: string;
  name: string;
  status: string;
  date: string;
  value: number;
  deleted?: boolean;
}

@Component({
  selector: 'app-export-report',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './export-report.html',
  styleUrls: ['./export-report.scss']
})
export class ExportReport implements OnInit {

  displayedColumns: string[] = [
    'id', 'name', 'status', 'date', 'value', 'deleted'
  ];

  dataSource: DashboardItem[] = [];

  constructor(
    private firebase: Firebase,
    public dialogRef: MatDialogRef<ExportReport>
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.firebase
      .getItems(this.firebase.urlDatabaseItems + '.json')
      .subscribe((data: Record<string, DashboardItem> | null) => {

        this.dataSource = Object.keys(data || {}).map(key => ({
          ...data![key],
          id: key
        }));

        console.log('📊 Items caricati:', this.dataSource);
      });
  }

  // ✅ EXPORT CSV
  exportCSV() {

    if (!this.dataSource.length) return;

    const headers = ['id', 'name', 'status', 'date', 'value', 'deleted'];

    const rows = this.dataSource.map(item => [
      item.id,
      item.name,
      item.status,
      item.date,
      item.value,
      item.deleted ? 'true' : 'false'
    ]);

    const csv =
      [headers, ...rows]
        .map(r => r.map(v => `"${v}"`).join(','))
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'items_report.csv';
    a.click();

    URL.revokeObjectURL(url);

    console.log('✅ CSV esportato');
  }

  close() {
    this.dialogRef.close();
  }
}