import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ValidationRowModalComponent} from "../validation-row-modal/validation-row-modal.component";

@Component({
  selector: 'app-matrix-edit',
  templateUrl: './matrix-edit.component.html',
  styleUrls: ['./matrix-edit.component.css']
})
export class MatrixEditComponent {
  rows: number = 3;
  cols: number = 3;
  matrix: number[][] = [];
  initialVector: number[]=[];

  constructor(private http: HttpClient, public dialog: MatDialog ) {
    this.initializeMatrix();
  }

  initializeMatrix() {
    this.matrix = [];
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(0.0);
      }
      this.initialVector.push(0.0);
      this.matrix.push(row);
    }
  }

  onCellMatrixBlur(value: any, rowIndex: number, colIndex: number) {
      this.matrix[rowIndex][colIndex] = value;
      console.log(value)
  }

  onCellVectorBlur(value: any, colIndex: number) {
    this.initialVector[colIndex] = value;
    console.log(value)
  }

  saveChanges() {
    if (this.validateMatrixRowSumToOne()) {
    console.log("Zapisano zmiany: ", this.matrix);
    this.sendMatrixAndInitialVectorToBackend();
    }
  }

  validateMatrixRowSumToOne():boolean{
    let isValid = true;
    for (let i = 0; i < this.rows; i++) {
      const rowSum = this.matrix[i].reduce((sum, value) => sum + value, 0);
      if (Math.abs(rowSum - 1) > 0.0001) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      this.dialog.open(ValidationRowModalComponent, {
        data: { title: 'Błąd walidacji', message: 'Proszę poprawić macierz, aby suma każdego wiersza wynosiła 1.' }
      });
    }
    return isValid;
  }

  sendMatrixAndInitialVectorToBackend(){
    const data = {
      transitionMatrix: this.matrix.map(row => row.map(Number)),
      initialVector: this.initialVector.map(Number)
    };

    const jsonData = JSON.stringify(data);

    const headers = {'Content-Type': 'application/json'};
    this.http.put('/markovchain/matrixAndVector', jsonData, {headers: headers})
      .subscribe(response => {
        console.log('Dane zostały pomyślnie wysłane na serwer.', response);
      }, error => {
        console.error('Błąd podczas wysyłania danych na serwer.', error);
      });
  }

  moveMatrixFocus(rowIndex: number, colIndex: number, event: KeyboardEvent): void {
    event.preventDefault();
    if (rowIndex >= 0 && rowIndex < this.matrix.length && colIndex >= 0 && colIndex < this.matrix[0].length) {
      console.log("dzialam")
      const inputId = 'matrixInput_' + rowIndex + '_' + colIndex;
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }

  moveVectorFocus(colIndex: number, event: KeyboardEvent): void {
    event.preventDefault();
    if (colIndex >= 0 && colIndex < this.matrix.length) {
      console.log("dzialam")
      const inputId = 'vectorInput_' + colIndex;
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }
}
