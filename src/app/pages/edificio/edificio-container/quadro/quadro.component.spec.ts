import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadroComponent } from './quadro.component';

describe('QuadroComponent', () => {
  let component: QuadroComponent;
  let fixture: ComponentFixture<QuadroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuadroComponent]
    });
    fixture = TestBed.createComponent(QuadroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
