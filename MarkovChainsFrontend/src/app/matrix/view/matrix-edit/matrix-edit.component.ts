import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ValidationRowModalComponent} from "../validation-row-modal/validation-row-modal.component";
import {MatrixAndVector} from "../../model/matrixAndVector";
import {MatrixAndVectorService} from "../../service/matrix-and-vector-service";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-matrix-edit',
  templateUrl: './matrix-edit.component.html',
  styleUrls: ['./matrix-edit.component.css']
})
export class MatrixEditComponent {
  rowsAndColumns: number = 3;
  data: MatrixAndVector = { transitionMatrix:[], initialVector:[]};
  finalProbability: number[] = [];
  constructor(private matrixAndVectorService: MatrixAndVectorService,
              public dialog: MatDialog ) {
    this.initializeMatrix();
  }

  initializeMatrix() {
    this.data.transitionMatrix = [];
    this.data.initialVector=[]
    for (let i = 0; i < this.rowsAndColumns; i++) {
      let row = [];
      for (let j = 0; j < this.rowsAndColumns; j++) {
        row.push(0.0);
      }
      this.data.transitionMatrix.push(row);
      this.data.initialVector.push(0.0);
    }
  }

  onCellMatrixBlur(value: any, rowIndex: number, colIndex: number) {
      this.data.transitionMatrix[rowIndex][colIndex] = value;
      console.log(value)
  }

  onCellVectorBlur(value: any, colIndex: number) {
    this.data.initialVector[colIndex] = value;
    console.log(value)
  }

  onSave() {
    if (this.validateMatrixRowSumToOne()) {
      console.log("Zapisano zmiany: ", this.data.transitionMatrix);
      this.matrixAndVectorService.putVectorAndMatrix(this.data!).subscribe(
        response => {
          console.log('Response:', response);
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  }

  onFinalProbability(){
    this.matrixAndVectorService.getFinalProbability()
      .pipe(
        tap(data => {
          this.finalProbability = data; // Ustawia otrzymane dane jako ostateczne prawdopodobieństwo
        })
      )
      .subscribe({
        error: error => {
          console.error('An error occurred:', error);
          // Obsługa błędów
        }
      });
  }

  validateMatrixRowSumToOne():boolean{
    let isValid = true;
    for (let i = 0; i < this.rowsAndColumns; i++) {
      const rowSum = this.data.transitionMatrix[i].reduce((sum, value) => sum + value, 0);
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


  moveMatrixFocus(rowIndex: number, colIndex: number, event: KeyboardEvent): void {
    event.preventDefault();
    if (rowIndex >= 0 && rowIndex < this.data.transitionMatrix.length && colIndex >= 0 && colIndex < this.data.transitionMatrix[0].length) {
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
    if (colIndex >= 0 && colIndex < this.data.initialVector.length) {
      console.log("dzialam")
      const inputId = 'vectorInput_' + colIndex;
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }
}
