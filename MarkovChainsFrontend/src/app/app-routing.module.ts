import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MatrixEditDetailsComponent} from "./matrix/view/matrix-edit-details/matrix-edit-details.component";
import {GraphPageComponent} from "./graph/graph-page.component";
import { TheoryComponent } from './theory/theory.component';

const routes: Routes = [
  {
    component: MatrixEditDetailsComponent,
    path: "matrix",
    data: {showHamburgerMenu: false}
  },
  {
    component: GraphPageComponent,
    path: "graph",
    data: {showHamburgerMenu: true}
  },
  {
    component:TheoryComponent,
    path:"theory",
    data: {showHamburgerMenu: false}
  },
  {
    path:"**",
    redirectTo:"/theory"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
