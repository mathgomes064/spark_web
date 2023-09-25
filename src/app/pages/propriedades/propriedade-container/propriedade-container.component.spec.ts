import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropriedadeContainerComponent } from './propriedade-container.component';

describe('PropriedadeContainerComponent', () => {
  let component: PropriedadeContainerComponent;
  let fixture: ComponentFixture<PropriedadeContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropriedadeContainerComponent]
    });
    fixture = TestBed.createComponent(PropriedadeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
