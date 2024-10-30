import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidTransferHistoryComponent } from './liquid-transfer-history.component';

describe('LiquidTransferHistoryComponent', () => {
  let component: LiquidTransferHistoryComponent;
  let fixture: ComponentFixture<LiquidTransferHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiquidTransferHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiquidTransferHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
