import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartimentoComponent } from './compartimento.component';

describe('CompartimentoComponent', () => {
  let component: CompartimentoComponent;
  let fixture: ComponentFixture<CompartimentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompartimentoComponent]
    });
    fixture = TestBed.createComponent(CompartimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
