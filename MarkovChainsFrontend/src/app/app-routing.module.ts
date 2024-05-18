import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MatrixEditComponent} from "./matrix/view/matrix-edit/matrix-edit.component";
import {GraphPageComponent} from "./graph/graph-page.component";
import { TheoryComponent } from './theory/theory.component';

const routes: Routes = [
  {
    component: MatrixEditComponent,
    path: "matrix"
  },
  {
    component: GraphPageComponent,
    path: "graph"
  },
  {
    component:TheoryComponent,
    path:"theory"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
