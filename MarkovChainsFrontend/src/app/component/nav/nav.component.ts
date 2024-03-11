import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {NavService} from "./nav.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  lang:string ='';
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private translateService:TranslateService, private navService: NavService){

  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'pl';
  }

  toggleSidebar(){
    this.navService.toggleSidebar();
  }
  ChangeLang(lang:any){
    const selectedLanguage = lang.target.value;

    localStorage.setItem('lang',selectedLanguage);

    this.translateService.use(selectedLanguage);

  }
}
