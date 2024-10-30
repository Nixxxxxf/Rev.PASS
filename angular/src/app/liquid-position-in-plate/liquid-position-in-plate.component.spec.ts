import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidPositionInPlateComponent } from './liquid-position-in-plate.component';

describe('LiquidPositionInPlateComponent', () => {
  let component: LiquidPositionInPlateComponent;
  let fixture: ComponentFixture<LiquidPositionInPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiquidPositionInPlateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiquidPositionInPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
