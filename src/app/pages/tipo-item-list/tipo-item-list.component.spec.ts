import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoItemListComponent } from './tipo-item-list.component';

describe('TipoItemListComponent', () => {
  let component: TipoItemListComponent;
  let fixture: ComponentFixture<TipoItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoItemListComponent]
    });
    fixture = TestBed.createComponent(TipoItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
