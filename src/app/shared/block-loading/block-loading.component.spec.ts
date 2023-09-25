import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockLoadingComponent } from './block-loading.component';

describe('BlockLoadingComponent', () => {
  let component: BlockLoadingComponent;
  let fixture: ComponentFixture<BlockLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockLoadingComponent]
    });
    fixture = TestBed.createComponent(BlockLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
