import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenePlateResultComponent } from './gene-plate-result.component';

describe('GenePlateResultComponent', () => {
  let component: GenePlateResultComponent;
  let fixture: ComponentFixture<GenePlateResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenePlateResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenePlateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
