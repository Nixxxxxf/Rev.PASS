import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplePlateResultComponent } from './sample-plate-result.component';

describe('SamplePlateResultComponent', () => {
  let component: SamplePlateResultComponent;
  let fixture: ComponentFixture<SamplePlateResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamplePlateResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SamplePlateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
