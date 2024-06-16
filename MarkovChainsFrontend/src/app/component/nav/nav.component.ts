import {AfterViewInit, Component, EventEmitter, OnChanges, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {NavService} from "./nav.service";
import {Router, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  lang:string ='';
  currentUrl: string = '';
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private translateService:TranslateService, private navService: NavService, private router: Router) {

  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'pl';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  toggleSidebar(){
    this.navService.toggleSidebar();
  }
  // ChangeLang(selectedLanguage: string){
  //   localStorage.setItem('lang',selectedLanguage);
  //   this.translateService.use(selectedLanguage);
  // }
  ChangeLang(lang:any){
    const selectedLanguage = lang.target.value;

    localStorage.setItem('lang',selectedLanguage);

    this.translateService.use(selectedLanguage);

  }
}
