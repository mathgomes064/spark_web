import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoItemContainerComponent } from './tipo-item-container.component';

describe('TipoItemContainerComponent', () => {
  let component: TipoItemContainerComponent;
  let fixture: ComponentFixture<TipoItemContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoItemContainerComponent]
    });
    fixture = TestBed.createComponent(TipoItemContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
