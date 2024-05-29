import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavService {
  toggleSidebarEvent: Subject<void> = new Subject<void>();
  constructor() {}

  toggleSidebar(){
    this.toggleSidebarEvent.next();
  }
}
