import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientDilutionComponent } from './gradient-dilution.component';

describe('GradientDilutionComponent', () => {
  let component: GradientDilutionComponent;
  let fixture: ComponentFixture<GradientDilutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GradientDilutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradientDilutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
