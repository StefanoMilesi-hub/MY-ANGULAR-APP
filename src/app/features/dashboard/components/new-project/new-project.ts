import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-project',
  standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule],
  templateUrl: './new-project.html',
  styleUrls: ['./new-project.scss']
})

export class NewProject {

  constructor(private dialogRef: MatDialogRef<NewProject>) {}

  // ✅ FORM REATTIVO
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    status: new FormControl('active'),
    date: new FormControl(''),
    value: new FormControl(0),
    deleted: new FormControl(false)
  });

  // ✅ dati lista
  private items: any[] = [];

  // ✅ getter per il template
  dashboardItems() {
    return this.items;
  }

  // ✅ aggiunta elemento
  onItemAdded(item: any) {
    this.items.push(item);
  }

  // ✅ rimozione elemento
  onDeleteItem(item: any) {
    this.items = this.items.filter(i => i !== item);
  }

  onCancel() {
    this.dialogRef.close();
  }

  // ✅ submit form
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const project = {
      ...this.form.value,
      items: this.items
    };

    console.log('✅ Progetto creato:', project);

    // eventuale reset
    this.form.reset({
      status: 'active',
      value: 0
    });

    this.items = [];

    // ✅ chiude il dialog e restituisce il progetto al parent
    this.dialogRef.close(project);

  }
}