import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationIconComponent } from './participation-icon.component';

describe('ParticipationIconComponent', () => {
  let component: ParticipationIconComponent;
  let fixture: ComponentFixture<ParticipationIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipationIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipationIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
