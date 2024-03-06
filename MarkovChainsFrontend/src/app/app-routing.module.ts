import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MatrixEditComponent} from "./matrix/view/matrix-edit/matrix-edit.component";

const routes: Routes = [
  {
    component: MatrixEditComponent,
    path: "matrix"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
