import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { UserPartial } from '../../models/user.model';

@Component({
  selector: 'ky-show-phone-dialog',
  templateUrl: './show-phone.dialog.html',
  styleUrl: './show-phone.dialog.scss',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ShowPhoneDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: UserPartial) {}
}