import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietarioContainerComponent } from './proprietario-container.component';

describe('ProprietarioContainerComponent', () => {
  let component: ProprietarioContainerComponent;
  let fixture: ComponentFixture<ProprietarioContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProprietarioContainerComponent]
    });
    fixture = TestBed.createComponent(ProprietarioContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
