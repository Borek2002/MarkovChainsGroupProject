import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRowModalComponent } from './validation-row-modal.component';

describe('ValidationRowModalComponent', () => {
  let component: ValidationRowModalComponent;
  let fixture: ComponentFixture<ValidationRowModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationRowModalComponent]
    });
    fixture = TestBed.createComponent(ValidationRowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
