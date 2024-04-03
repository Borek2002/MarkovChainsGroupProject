import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatrixAndVector} from "../model/matrixAndVector";
import {catchError, map, Observable, Subject} from "rxjs";
import {Node, Edge} from "@swimlane/ngx-graph";
const headers = {'Content-Type': 'application/json'};
@Injectable()
export class MatrixAndVectorService {

  private updateGraphSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  getFinalProbability(): Observable<number[]>{
    return this.http.get<number[]>('/markovchain/finalProbability');
  }

  getProbabilityAfterNSteps(): Observable<number[]>{
    return this.http.get<number[]>('/markovchain/finalProbability');
  }

  getStationaryProbability(): Observable<number[]>{
    return this.http.get<number[]>('/markovchain/stationaryDistribution');
  }

  getImmersiveState(): Observable<number>{
    return this.http.get<number>('/markovchain/immersiveState');
  }

  getMatrixAndVector(): Observable<any>{
    return this.http.get<MatrixAndVector>('/markovchain/matrixAndVector').pipe(
      map(response => {
        // Convert matrix data to graph data
        const nodes: Node[] = [];
        const edges: Edge[] = [];
        const rowsAndColumns = response.transitionMatrix.length;
        for (let i = 0; i < rowsAndColumns; i++) {
          nodes.push({
            id: '' + (i + 1),
            label: 'S'
          }as Node);
        }

        for (let i = 0; i < rowsAndColumns; i++) {
          for (let j = 0; j < rowsAndColumns; j++) {
            if (response.transitionMatrix[i][j] > 0) {
                edges.push({
                id: 'edge' + (edges.length + 1),
                source: '' + (i + 1),
                target: '' + (j + 1),
                label: '' + response.transitionMatrix[i][j],
              });
            }
          }
        }
        return {
          nodes: nodes,
          edges: edges
        };
      })
    );
  }

  putVectorAndMatrix(request: MatrixAndVector): Observable<any>{
    return this.http.put('/markovchain/matrixAndVector', request, { headers: headers })
      .pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          throw error; // Rzucenie błędu dalej, aby komponent mógł obsłużyć
        })
      );
  }
}
