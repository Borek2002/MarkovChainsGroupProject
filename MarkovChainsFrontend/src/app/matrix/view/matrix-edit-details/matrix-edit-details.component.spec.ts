import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixEditDetailsComponent } from './matrix-edit-details.component';

describe('MatrixEditComponent', () => {
  let component: MatrixEditDetailsComponent;
  let fixture: ComponentFixture<MatrixEditDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatrixEditDetailsComponent]
    });
    fixture = TestBed.createComponent(MatrixEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
