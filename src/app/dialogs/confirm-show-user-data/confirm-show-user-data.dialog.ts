import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { User } from '../../../types';

export type ConfirmShowUserDataDialogData = {
  user: User,
  type: 'phone' | 'email'
};

@Component({
  selector: 'app-confirm-show-user-data-dialog',
  templateUrl: './confirm-show-user-data.dialog.html',
  styleUrl: './confirm-show-user-data.dialog.scss',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmShowUserDataDialog {
  dataName: string
  article: string

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmShowUserDataDialogData) {
    switch (data.type) {
      case 'phone':
        this.dataName = 'numéro de téléphone'
        this.article = 'le '
        break
      case 'email':
        this.dataName = 'adresse mail'
        this.article = "l'"
        break
    }
  }
}