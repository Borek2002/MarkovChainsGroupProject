import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-validation-modal',
  template: `
    <h1>{{ data.title }}</h1>
    <p>{{ data.message }}</p>
    <button mat-button (click)="close()">Zamknij</button>
  `,
})
export class ValidationRowModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    public dialogRef: MatDialogRef<ValidationRowModalComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
