import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { User } from '../../../types';

@Component({
  selector: 'app-confirm-show-phone-dialog',
  templateUrl: './confirm-show-phone.dialog.html',
  styleUrl: './confirm-show-phone.dialog.scss',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmShowPhoneDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {}
}