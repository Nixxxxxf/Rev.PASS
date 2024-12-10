import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneTypingAlgorithmComponent } from './gene-typing-algorithm.component';

describe('GeneTypingAlgorithmComponent', () => {
  let component: GeneTypingAlgorithmComponent;
  let fixture: ComponentFixture<GeneTypingAlgorithmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneTypingAlgorithmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneTypingAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
