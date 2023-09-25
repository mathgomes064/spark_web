import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTipoItemComponent } from './update-tipo-item.component';

describe('UpdateTipoItemComponent', () => {
  let component: UpdateTipoItemComponent;
  let fixture: ComponentFixture<UpdateTipoItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTipoItemComponent]
    });
    fixture = TestBed.createComponent(UpdateTipoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
