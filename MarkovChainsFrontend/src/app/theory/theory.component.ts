import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-theory',
  templateUrl: './theory.component.html',
  styleUrls: ['./theory.component.css']
})
export class TheoryComponent {
  imageURL: string = 'assets/Markov.png';
  image2URL: string = 'assets/Markov2.png'
  image3URL: string = 'assets/Markov3.png';

}
