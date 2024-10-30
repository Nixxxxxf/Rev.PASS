import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidCategoryComponent } from './liquid-category.component';

describe('LiquidCategoryComponent', () => {
  let component: LiquidCategoryComponent;
  let fixture: ComponentFixture<LiquidCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiquidCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiquidCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
