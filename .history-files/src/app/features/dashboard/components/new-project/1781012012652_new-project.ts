import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-project.html'
})
export class NewProject {

  form = this.fb.group({
    name: [''],
    value: [0]
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewProject>
  ) {}

  submit() {
    this.dialogRef.close(this.form.value);
  }
}