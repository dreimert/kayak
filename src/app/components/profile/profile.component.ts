import { Component } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Observable, firstValueFrom, map, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { User } from '../../../types';
import { RouterModule } from '@angular/router';
// import { ApolloQueryResult } from '@apollo/client';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    FormsModule, RouterModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class ProfileComponent {
  profileForm = this._formBuilder.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\+\d{7,15}$/)]],
  });

  sent = false;

  profile$: Observable<User> | null = null
  // profile$: any

  constructor(
    private _formBuilder: NonNullableFormBuilder,
    private apollo: Apollo,
    private authService: AuthService
  ) {
    authService.user$.subscribe((user) => {
      this.profileForm.patchValue({
        name: user?.name || '',
        phone: user?.phone || '',
      });
    });
  }

  async onSubmit() {
    this.profileForm.disable();

    this.sent = true;

    const user = await firstValueFrom(this.authService.user$)

    // updateProfile(user: ID!, name: String!, phone: PhoneNumber!): User!
    this.profile$ = this.apollo.mutate<{updateProfile: User}>({
      mutation: gql`
        mutation UpdateProfile($userId: ID!, $name: String!, $phone: PhoneNumber!) {
          updateProfile(userId: $userId, name: $name, phone: $phone) {
            id
            name
            email
            phone
          }
        }
      `,
      variables: {
        userId: user!.id,
        ...this.profileForm.value,
      },
    }).pipe(
      map(result => result.data!.updateProfile),
      tap(() => {
        this.authService.reCheckAuthenticated()
      })
    );
  }
}
