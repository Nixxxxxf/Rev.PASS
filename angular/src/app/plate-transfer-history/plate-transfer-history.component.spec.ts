import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateTransferHistoryComponent } from './plate-transfer-history.component';

describe('PlateTransferHistoryComponent', () => {
  let component: PlateTransferHistoryComponent;
  let fixture: ComponentFixture<PlateTransferHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlateTransferHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlateTransferHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
