import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvHeaderComponent } from './csv-header.component';

describe('CsvHeaderComponent', () => {
  let component: CsvHeaderComponent;
  let fixture: ComponentFixture<CsvHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CsvHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CsvHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
