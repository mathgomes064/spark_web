import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtributoContainerComponent } from './atributo-container.component';

describe('AtributoContainerComponent', () => {
  let component: AtributoContainerComponent;
  let fixture: ComponentFixture<AtributoContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtributoContainerComponent]
    });
    fixture = TestBed.createComponent(AtributoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
