import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit{
  name = 'Angular';
  rows = 3;
  cols = 3;
  form: any = new FormArray([])
  ngOnInit() {
    for (let i = 0; i < this.rows; i++) {
      this.form.push(new FormArray([]))
      for (let j = 0; j < this.cols; j++) {
        (this.form.at(i) as FormArray).push(new FormControl())
      }
    }
  }

  resizeMatrix(newRows: number, newCols: number) {
    while (this.rows < newRows) {
      this.addRow();
    }
    while (this.rows > newRows) {
      this.removeRow();
    }
    while (this.cols < newCols) {
      this.addColumn();
    }
    while (this.cols > newCols) {
      this.removeColumn();
    }
  }

  addRow() {
    const newRow: any = new FormArray([]);
    for (let j = 0; j < this.cols; j++) {
      newRow.push(new FormControl());
    }
    this.form.push(newRow);
    this.rows++;
  }

  removeRow() {
    this.form.removeAt(this.rows - 1);
    this.rows--;
  }

  addColumn() {
    for (let i = 0; i < this.rows; i++) {
      (this.form.at(i) as FormArray).push(new FormControl());
    }
    this.cols++;
  }

  removeColumn() {
    for (let i = 0; i < this.rows; i++) {
      (this.form.at(i) as FormArray).removeAt(this.cols - 1);
    }
    this.cols--;
  }
}
