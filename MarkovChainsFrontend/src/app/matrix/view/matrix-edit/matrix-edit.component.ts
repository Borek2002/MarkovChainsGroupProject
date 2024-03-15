import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import { GraphComponent } from '../../../graph/graph.component'
import {ValidationRowModalComponent} from "../validation-row-modal/validation-row-modal.component";
import {link} from "d3";

@Component({
  selector: 'app-matrix-edit',
  templateUrl: './matrix-edit.component.html',
  styleUrls: ['./matrix-edit.component.css']
})
export class MatrixEditComponent implements OnInit{
  rows: number = 3;
  cols: number = 3;
  matrix: number[][] = [];
  initialVector: number[]=[];

  @Output() nodesUpdated = new EventEmitter<any[]>();
  @Output() linksUpdated = new EventEmitter<any[]>();
  constructor(private http: HttpClient, public dialog: MatDialog ) {
    this.initializeMatrix();
  }

  ngOnInit(){
    this.saveChanges();
  }

  // initializeMatrix() {
  //   this.matrix = [];
  //   for (let i = 0; i < this.rows; i++) {
  //     let row = [];
  //     for (let j = 0; j < this.cols; j++) {
  //       row.push(0.0);
  //     }
  //     this.initialVector.push(0.0);
  //     this.matrix.push(row);
  //   }
  // }
  initializeMatrix() {
    this.matrix = [];
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      let rowSum = 0; // sum of elements in the row
      for (let j = 0; j < this.cols; j++) {
        // Generating a floating-point number with two decimal places
        let randomNum = Math.random() * 100; // Range 0-100 for two decimal places
        randomNum = Math.round(randomNum) / 100; // Rounding to two decimal places
        row.push(randomNum);
        rowSum += randomNum; // Adding the number to the row sum
      }

      // Scaling the row so that the sum is equal to 1
      for (let j = 0; j < this.cols; j++) {
        row[j] /= rowSum;
        // Rounding to two decimal places
        row[j] = Math.round(row[j] * 100) / 100;
      }

      // Correction to ensure the sum of the row is exactly 1 after rounding
      let sumDifference = 1 - row.reduce((acc, val) => acc + val, 0);
      // Adding the difference to the last element of the row
      row[row.length - 1] += sumDifference;
      row[row.length - 1] = parseFloat(row[row.length - 1].toFixed(2));
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
    this.validateMatrixRowSumToOne();
    console.log("Zapisano zmiany: ", this.matrix);

    // Convert matrix data to graph data
    const nodes = [];
    const links = [];

    for (let i = 0; i < this.rows; i++) {
      nodes.push({
        id: '' + (i + 1),
        label: 'S'
      });
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.matrix[i][j] > 0) {
          links.push({
            id: 'edge' + (links.length + 1),
            source: '' + (i + 1),
            target: '' + (j + 1),
            label: '' + this.matrix[i][j],
          });
        }
      }
    }

    // Send graph data to the Graph component to be visualized
    this.nodesUpdated.emit(nodes);
    this.linksUpdated.emit(links);
    //this.graphComponent.update$.next(true);
    //this.sendMatrixAndInitialVectorToBackend();
  }

  validateMatrixRowSumToOne(){
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
      return;
    }
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
}
