import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./component/header/header.component";
import {MainComponent} from "./component/main/main.component";
import {NavComponent} from "./component/nav/nav.component";
import { FooterComponent } from './component/footer/footer.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { MatrixEditComponent } from './matrix/view/matrix-edit/matrix-edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationRowModalComponent } from './matrix/view/validation-row-modal/validation-row-modal.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {GraphPageComponent} from './graph/graph-page.component';
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {MaterialModule} from "./graph/utils/material.module";
import {GraphComponent} from "./graph/ui/graph.component";
import {MatrixAndVectorService} from "./matrix/service/matrix-and-vector-service";
import { TheoryComponent } from './theory/theory.component';

export function HttpLoaderFactory(http:HttpClient){
  return new  TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    NavComponent,
    FooterComponent,
    MatrixEditComponent,
    ValidationRowModalComponent,
    GraphComponent,
    GraphPageComponent,
    TheoryComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgxGraphModule,
    MaterialModule
  ],
  providers: [MatrixAndVectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
