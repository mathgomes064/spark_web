import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdificioContainerComponent } from './edificio-container.component';

describe('EdificioContainerComponent', () => {
  let component: EdificioContainerComponent;
  let fixture: ComponentFixture<EdificioContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdificioContainerComponent]
    });
    fixture = TestBed.createComponent(EdificioContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
