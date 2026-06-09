import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-project.html'
})
export class NewProject {

    
    form!: FormGroup;

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<NewProject>
    ) {
    this.form = this.fb.group({
        email: [''],
        value: [0]
    });
    }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}