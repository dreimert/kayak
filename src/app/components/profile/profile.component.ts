import { Component, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { pairwise, map, tap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { User } from '../../models/user.model';
import { ActivityType, ActivityTypeLabelsList, ActivityTypeToIcon, ActivityTypeToLabel, Paddle, PaddleColor, PaddleColorLabelsList, PaddleColorToLabel } from '../../../types';
import { AuthService } from '../../services/auth.service';
// import { ApolloQueryResult } from '@apollo/client';

@Component({
  selector: 'ky-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, RouterModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    AsyncPipe,
  ],
})
export class ProfileComponent implements OnInit {
  @Input() user: User;

  ActivityTypeLabelsList = ActivityTypeLabelsList;
  PaddleActivityTypeLabelsList = ActivityTypeLabelsList.filter(type => type.paddleColor);
  ActivityTypeToIcon = ActivityTypeToIcon;
  ActivityTypeToLabel = ActivityTypeToLabel;
  PaddleColorLabelsList = PaddleColorLabelsList
  PaddleColorToLabel = PaddleColorToLabel;

  profileForm = this._formBuilder.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\+\d{7,15}$/)]],
    notifications: [[] as ActivityType[]],
    paddles: [[] as Paddle[]],
  });

  sent = false;

  profile$: Observable<User> | null = null

  constructor(
    private _formBuilder: NonNullableFormBuilder,
    private apollo: Apollo,
    private authService: AuthService
  ) {
    this.profileForm.controls.paddles.valueChanges
      .pipe(takeUntilDestroyed())
      .pipe(pairwise())
      .pipe(map(([previous, current]) => {
        if (previous.length >= current.length) {
          return
        }

        const add = current.find(p => !previous.includes(p))!

        const sameActivityType = current.find(p => p.activityType === add.activityType && p !== add)

        if (sameActivityType) {
          return current.filter(p => p !== sameActivityType)
        } else {
          return
        }
      }))
      .subscribe((value) => {
        if (value) {
          this.profileForm.controls.paddles.patchValue(value)
        }
      })
  }

  ngOnInit(): void {
    console.log('ProfileComponent', this.user);

    this.profileForm.patchValue({
      name: this.user.name || '',
      phone: this.user.phone || '',
      notifications: this.user.notifications || [],
      paddles: this.user.paddles || [],
    });
  }

  comparePaddleColor(a: Paddle, b: Paddle) {
    return a.color === b.color && a.activityType === b.activityType
  }

  async onSubmit() {
    this.profileForm.disable();

    this.sent = true;

    // updateProfile(user: ID!, name: String!, phone: PhoneNumber!): User!
    this.profile$ = this.apollo.mutate<{updateProfile: User}>({
      mutation: gql`
        mutation UpdateProfile($userId: ID!, $input: ProfileInput!) {
          updateProfile(userId: $userId, input: $input) {
            id
            name
            email
            phone
            clubs { id name }
            notifications
            paddles { activityType color }
          }
        }
      `,
      variables: {
        userId: this.user.id,
        input: this.profileForm.value,
      },
    }).pipe(
      map(result => result.data!.updateProfile),
      tap(() => {
        this.authService.reCheckAuthenticated()
      })
    );
  }
}

export default ProfileComponent;