import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmShowPhoneDialog } from './confirm-show-phone.dialog';

describe('ConfirmShowPhoneDialog', () => {
  let component: ConfirmShowPhoneDialog;
  let fixture: ComponentFixture<ConfirmShowPhoneDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmShowPhoneDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmShowPhoneDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
