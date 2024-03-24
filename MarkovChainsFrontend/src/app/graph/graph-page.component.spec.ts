import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPageComponent } from './graph-page.component';

describe('GraphComponent', () => {
  let component: GraphPageComponent;
  let fixture: ComponentFixture<GraphPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphPageComponent]
    });
    fixture = TestBed.createComponent(GraphPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
