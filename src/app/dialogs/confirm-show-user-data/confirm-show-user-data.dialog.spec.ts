import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmShowUserDataDialog } from './confirm-show-user-data.dialog';

describe('ConfirmShowUserDataDialog', () => {
  let component: ConfirmShowUserDataDialog;
  let fixture: ComponentFixture<ConfirmShowUserDataDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmShowUserDataDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmShowUserDataDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
