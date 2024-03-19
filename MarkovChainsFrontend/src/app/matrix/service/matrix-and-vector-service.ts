import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatrixAndVector} from "../model/matrixAndVector";
import {catchError, Observable} from "rxjs";
const headers = {'Content-Type': 'application/json'};
@Injectable()
export class MatrixAndVectorService {

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

  putVectorAndMatrix(request: MatrixAndVector): Observable<any>{
    console.log("asda")
    return this.http.put('/markovchain/matrixAndVector', request, { headers: headers })
      .pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          throw error; // Rzucenie błędu dalej, aby komponent mógł obsłużyć
        })
      );
  }

}
