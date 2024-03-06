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
import {FormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationRowModalComponent } from './matrix/view/validation-row-modal/validation-row-modal.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
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
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
