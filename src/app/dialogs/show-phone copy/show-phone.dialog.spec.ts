import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPhoneDialog } from './show-phone.dialog';

describe('ShowPhoneDialog', () => {
  let component: ShowPhoneDialog;
  let fixture: ComponentFixture<ShowPhoneDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPhoneDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPhoneDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
