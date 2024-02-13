import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserDataDialog } from './show-user-data.dialog';

describe('ShowPhoneDialog', () => {
  let component: ShowUserDataDialog;
  let fixture: ComponentFixture<ShowUserDataDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUserDataDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUserDataDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
