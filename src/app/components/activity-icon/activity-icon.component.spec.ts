import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityIconComponent } from './activity-icon.component';

describe('ActivityIconComponent', () => {
  let component: ActivityIconComponent;
  let fixture: ComponentFixture<ActivityIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
