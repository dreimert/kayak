import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { User } from '../../../types';

export type ShowUserDataDialogData = {
  user: User
  data: string
  type: 'phone' | 'email'
}

@Component({
  selector: 'app-show-user-data-dialog',
  templateUrl: './show-user-data.dialog.html',
  styleUrl: './show-user-data.dialog.scss',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ShowUserDataDialog {
  titleData: string
  contentData: string

  constructor(@Inject(MAT_DIALOG_DATA) public data: ShowUserDataDialogData) {
    switch (data.type) {
      case 'phone':
        this.titleData = 'Numéro de téléphone'
        this.contentData = 'Le numéro de téléphone'
        break
      case 'email':
        this.titleData = 'Adresse mail'
        this.contentData = "L'adresse mail"
        break
    }
  }
}