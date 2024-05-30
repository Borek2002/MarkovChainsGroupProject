import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMatrixComponent } from './graph-matrix.component';

describe('GraphMatrixComponent', () => {
  let component: GraphMatrixComponent;
  let fixture: ComponentFixture<GraphMatrixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphMatrixComponent]
    });
    fixture = TestBed.createComponent(GraphMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
