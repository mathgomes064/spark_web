import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAtributoContainerComponent } from './update-atributo-container.component';

describe('UpdateAtributoContainerComponent', () => {
  let component: UpdateAtributoContainerComponent;
  let fixture: ComponentFixture<UpdateAtributoContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAtributoContainerComponent]
    });
    fixture = TestBed.createComponent(UpdateAtributoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
