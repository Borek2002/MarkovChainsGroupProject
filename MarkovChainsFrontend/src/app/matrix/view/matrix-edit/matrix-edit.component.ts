import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ValidationRowModalComponent} from "../validation-row-modal/validation-row-modal.component";
import {Node, Edge, Graph} from "@swimlane/ngx-graph";
import {MatrixAndVector} from "../../model/matrixAndVector";
import {MatrixAndVectorService} from "../../service/matrix-and-vector-service";

@Component({
  selector: 'app-matrix-edit',
  templateUrl: './matrix-edit.component.html',
  styleUrls: ['./matrix-edit.component.css']
})

export class MatrixEditComponent implements OnInit{
  rowsAndColumns: number = 3;
  data: MatrixAndVector = {transitionMatrix: [], initialVector: []};
  finalProbability: number[] = [];
  probabilityAfterNSteps: number[] = [];
  stationaryProbability: number[] = [];
  matrix: number[][] = [];
  initialVector: number[]=[];

  @Output() graphUpdated = new EventEmitter<void>();

  constructor(private matrixAndVectorService: MatrixAndVectorService,
              public dialog: MatDialog) {
    this.initializeMatrix();
  }

  ngOnInit(): void {
  }

  initializeMatrix() {
    this.data.transitionMatrix = [];
    this.data.initialVector = []
    for (let i = 0; i < this.rowsAndColumns; i++) {
      let row = [];
      /*let rowSum = 0; // sum of elements in the row
      for (let j = 0; j < this.rowsAndColumns; j++) {
        // Generating a floating-point number with two decimal places
        let randomNum = Math.random() * 100; // Range 0-100 for two decimal places
        randomNum = Math.round(randomNum) / 100; // Rounding to two decimal places
        row.push(randomNum);
        rowSum += randomNum; // Adding the number to the row sum
      }

      // Scaling the row so that the sum is equal to 1
      for (let j = 0; j < this.rowsAndColumns; j++) {
        row[j] /= rowSum;
        // Rounding to two decimal places
        row[j] = Math.round(row[j] * 100) / 100;
      }

      // Correction to ensure the sum of the row is exactly 1 after rounding
      let sumDifference = 1 - row.reduce((acc, val) => acc + val, 0);
      // Adding the difference to the last element of the row
      row[row.length - 1] += sumDifference;
      row[row.length - 1] = parseFloat(row[row.length - 1].toFixed(2));
      this.matrix.push(row);*/
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
          this.graphUpdated.emit();
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  }

  onFinalProbability() {
    this.matrixAndVectorService.getFinalProbability()
      .subscribe(result => this.finalProbability = result);
  }

  onProbabilityAfterNSteps() {
    this.matrixAndVectorService.getProbabilityAfterNSteps()
      .subscribe(result => this.probabilityAfterNSteps = result);
  }

  onStationaryProbability() {
    this.matrixAndVectorService.getStationaryProbability()
      .subscribe(result => this.stationaryProbability = result);
  }

  validateMatrixRowSumToOne(): boolean {
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
        data: {title: 'Błąd walidacji', message: 'Proszę poprawić macierz, aby suma każdego wiersza wynosiła 1.'}
      });
    }
    return isValid;
  }


  moveMatrixFocus(rowIndex: number, colIndex: number, event: KeyboardEvent): void {
    event.preventDefault();
    if (rowIndex >= 0 && rowIndex < this.data.transitionMatrix.length && colIndex >= 0 && colIndex < this.data.transitionMatrix[0].length) {
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
      const inputId = 'vectorInput_' + colIndex;
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }

}
