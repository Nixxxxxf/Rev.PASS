import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoReportComponent } from './echo-report.component';

describe('EchoReportComponent', () => {
  let component: EchoReportComponent;
  let fixture: ComponentFixture<EchoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EchoReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
