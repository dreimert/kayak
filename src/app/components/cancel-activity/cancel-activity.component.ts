import { Component, Input } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule, Router } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';

import { Club } from '../../models/club.model';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'ky-cancel-activity',
  templateUrl: './cancel-activity.component.html',
  styleUrl: './cancel-activity.component.scss',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, RouterModule,
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
  ],
})
export class CancelActivityComponent {
  @Input() club: Club;
  @Input() activity: Activity;

  cancelActivityForm = this._formBuilder.group({
    reason: ['', [Validators.required]],
  });

  constructor (
    private router: Router,
    private _formBuilder: NonNullableFormBuilder,
    private apollo: Apollo,
  ) {}

  async onSubmit () {
    this.cancelActivityForm.disable();

    const mutation = this.apollo.mutate<{cancelActivity: boolean}>({
      mutation: gql`
        mutation UpdateActivity($activityId: ID!, $reason: String!) {
          cancelActivity(activityId: $activityId, reason: $reason)
        }
      `,
      variables: {
        activityId: this.activity.id,
        reason: this.cancelActivityForm.value.reason,
      },
    }).pipe(
      map(result => result.data!.cancelActivity),
    );

    lastValueFrom(mutation).then((success) => {
      if (success) {
        this.router.navigateByUrl('/agenda');
      } else {
        this.cancelActivityForm.enable();
        alert('Une erreur est survenue lors de l\'annulation de l\'activité.');
      }
    }, (error) => {
      this.cancelActivityForm.enable();
      alert('Une erreur est survenue lors de l\'annulation de l\'activité.');
    })
  }
}

export default CancelActivityComponent;