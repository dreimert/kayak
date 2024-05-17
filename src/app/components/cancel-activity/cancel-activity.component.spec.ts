import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelActivityComponent } from './cancel-activity.component';

describe('CancelActivityComponent', () => {
  let component: CancelActivityComponent;
  let fixture: ComponentFixture<CancelActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
