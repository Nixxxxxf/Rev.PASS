import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneTypeSettingComponent } from './gene-type-setting.component';

describe('GeneTypeSettingComponent', () => {
  let component: GeneTypeSettingComponent;
  let fixture: ComponentFixture<GeneTypeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneTypeSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneTypeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
