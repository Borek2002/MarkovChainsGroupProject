import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatrixAndVector} from "../../model/matrixAndVector";
import {Subscription} from "rxjs";
import {MatrixAndVectorService} from "../../service/matrix-and-vector-service";
import {GraphDataService} from "../../../graph/data-access/GraphDataService";
import {MatDialog} from "@angular/material/dialog";
import {ValidationRowModalComponent} from "../validation-row-modal/validation-row-modal.component";

@Component({
  selector: 'app-graph-matrix',
  templateUrl: './graph-matrix.component.html',
  styleUrls: ['./graph-matrix.component.css']
})
export class GraphMatrixComponent implements OnInit{
  rowsAndColumns: number = 3;
  data: MatrixAndVector = { transitionMatrix: [], initialVector: [] };
  convertedData: MatrixAndVector = {transitionMatrix: [], initialVector: []};
  nSteps: number=0;
  finalProbability: number[] = [];
  probabilityAfterNSteps: number[] = [];
  stationaryProbability: number[] = [];
  immersiveState:number=-2;
  matrix: number[][] = [];
  initialVector: number[] = [];
  highlightedNode: { nodeId: string; color: string,  isSimulation: boolean} = {
        nodeId: '',
        color: '',
        isSimulation: false,
      };
  highlightedEdge: { source: string; target: string; color: string,  isSimulation: boolean} = {
        source: '',
        target: '',
        color: '',
        isSimulation: false,
      };

  hoveredNode: { nodeId: string; color: string} = {
        nodeId: '',
        color: '',
      };
  hoveredEdge: { source: string; target: string; color: string} = {
        source: '',
        target: '',
        color: '',
      };


  private nodeHighlightSubscription: Subscription = new Subscription();
  private edgeHighlightSubscription: Subscription = new Subscription();

  @Output() graphUpdated = new EventEmitter<void>();

  constructor(
    private matrixAndVectorService: MatrixAndVectorService,
    private graphDataService: GraphDataService,
    public dialog: MatDialog
  ) {
    this.initializeMatrix();
  }

  ngOnInit(): void {
    this.matrixAndVectorService.getMatrixAndVector().subscribe(
      (response) => {
        if (response) {
          this.data = response;
          this.rowsAndColumns=this.data.transitionMatrix.length;
        } else {
          this.initializeMatrix();
        }
      },
      (error) => {
        console.error('An error occurred: ' + error);
      }
    );

    this.nodeHighlightSubscription = this.graphDataService.highlightedNode$.subscribe((node) => {
          if (node.isSimulation) {
            this.highlightedNode = node;
          } else {
            this.hoveredNode = node;
          }
        });
        this.edgeHighlightSubscription = this.graphDataService.highlightedLink$.subscribe((edge) => {
          if (edge.isSimulation) {
            this.highlightedEdge = edge;
          } else {
            this.hoveredEdge = edge;
          }
        });
  }

   getBackgroundColor(i: number, j: number): string {
      // Sprawdzenie, czy jest najechane kursorem
      if (i + 1 === Number(this.hoveredNode.nodeId) ||
          (i + 1 === Number(this.hoveredEdge.source) && j + 1 === Number(this.hoveredEdge.target)) ){
        return this.hoveredNode.color || this.hoveredEdge.color;
      }

      // Sprawdzenie, czy jest podświetlone przez symulację
      if (i + 1 === Number(this.highlightedNode.nodeId) ||
          (i + 1 === Number(this.highlightedEdge.source) && j + 1 === Number(this.highlightedEdge.target))) {
        return this.highlightedNode.color || this.highlightedEdge.color;
      }

      return '#d8f3dc';
    }

  ngOnDestroy() {
    this.nodeHighlightSubscription.unsubscribe();
    this.edgeHighlightSubscription.unsubscribe();
  }

  highlightNode(nodeId: string) {
    this.highlightedNode.nodeId = nodeId;
  }

  initializeMatrix(): void {
    this.data.transitionMatrix = [];
    this.data.initialVector = [];
    for (let i = 0; i < this.rowsAndColumns; i++) {
      let column: number[] = [];
      for (let j = 0; j < this.rowsAndColumns; j++) {
        column.push(0.0);
      }
      this.data.transitionMatrix.push(column);
    }
    // Initialize the initial vector with zeros
    for (let i = 0; i < this.rowsAndColumns; i++) {
      this.data.initialVector.push(0.0);
    }
  }

  onCellMatrixBlur(value: any, rowIndex: number, colIndex: number) {
    this.data.transitionMatrix[rowIndex][colIndex] = value;
    console.log(value);
  }

  onCellVectorBlur(value: any, colIndex: number) {
    this.data.initialVector[colIndex] = value;
    console.log(value);
  }

  onSave() {
    if (this.validateMatrixRowSumToOne()) {
      console.log('Zapisano zmiany: ', this.data.transitionMatrix);

      this.highlightedNode = { nodeId: '',  color: '',  isSimulation: false};
      this.highlightedEdge = { source: '', target: '', color: '', isSimulation: false };
      this.hoveredNode = { nodeId: '', color: '' };
      this.hoveredEdge = { source: '', target: '', color: '' };

      this.matrixAndVectorService.putVectorAndMatrix(this.data!).subscribe(
        (response) => {
          console.log('Response:', response);
          this.graphUpdated.emit();
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  onFinalProbability() {
    this.matrixAndVectorService
      .getFinalProbability()
      .subscribe((result) => (this.finalProbability = result));
  }

  onProbabilityAfterNSteps() {
    this.matrixAndVectorService.getProbabilityAfterNSteps(this.nSteps)
      .subscribe(result => this.probabilityAfterNSteps = result);
  }

  onStationaryProbability() {
    this.matrixAndVectorService
      .getStationaryProbability()
      .subscribe((result) => (this.stationaryProbability = result));
  }

  onImmersiveState(){
    this.matrixAndVectorService.getImmersiveState()
      .subscribe((result)=>this.immersiveState=result)
  }

  validateMatrixRowSumToOne(): boolean {
    let isValid = true;
    for (let i = 0; i < this.rowsAndColumns; i++) {
      const rowSum = this.data.transitionMatrix[i].reduce(
        (sum, value) => sum + value,
        0
      );
      if (Math.abs(rowSum - 1) > 0.0001) {
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      this.dialog.open(ValidationRowModalComponent, {
        data: {
          title: 'Błąd walidacji',
          message:
            'Proszę poprawić macierz, aby suma każdego wiersza wynosiła 1.',
        },
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
