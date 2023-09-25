import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTipoItemComponent } from './register-tipo-item.component';

describe('RegisterTipoItemComponent', () => {
  let component: RegisterTipoItemComponent;
  let fixture: ComponentFixture<RegisterTipoItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterTipoItemComponent]
    });
    fixture = TestBed.createComponent(RegisterTipoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
