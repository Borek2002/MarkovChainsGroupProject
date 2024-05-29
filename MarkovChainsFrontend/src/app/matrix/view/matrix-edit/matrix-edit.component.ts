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
  convertedData: MatrixAndVector = {transitionMatrix: [], initialVector: []};
  nSteps: number=0;
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

  initializeMatrix(): void {
    this.data.transitionMatrix = [];
    this.data.initialVector = [];

    // Initialize the matrix with zeros in a column-major format
    for (let i = 0; i < this.rowsAndColumns; i++) {
      let column: number[] = [];
      for (let j = 0; j < this.rowsAndColumns; j++) {
        column.push(0.0);
      }
      this.data.transitionMatrix.push(column);
    }

    // Transpose the matrix to convert to row-major format


    // Initialize the initial vector with zeros
    for (let i = 0; i < this.rowsAndColumns; i++) {
      this.data.initialVector.push(0.0);
    }
  }

  transposeMatrix(matrix: number[][]): number[][] {
    let transposed: number[][] = [];
    for (let i = 0; i < matrix[0].length; i++) {
      transposed[i] = [];
      for (let j = 0; j < matrix.length; j++) {
        transposed[i][j] = matrix[j][i];
      }
    }
    return transposed;
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
      this.convertedData.transitionMatrix = this.transposeMatrix(this.data.transitionMatrix);
      this.convertedData.initialVector=this.data.initialVector;
      console.log("Zapisano zmiany: ", this.convertedData.transitionMatrix);
      this.matrixAndVectorService.putVectorAndMatrix(this.convertedData!).subscribe(
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
    this.matrixAndVectorService.getProbabilityAfterNSteps(this.nSteps)
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
        data: {
          title: 'Błąd walidacji',
          message: 'Proszę poprawić macierz, aby suma każdego wiersza wynosiła 1.'
        }
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
