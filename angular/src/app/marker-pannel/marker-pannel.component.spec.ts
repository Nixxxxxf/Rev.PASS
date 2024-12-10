import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerPannelComponent } from './marker-pannel.component';

describe('MarkerPannelComponent', () => {
  let component: MarkerPannelComponent;
  let fixture: ComponentFixture<MarkerPannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkerPannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkerPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
