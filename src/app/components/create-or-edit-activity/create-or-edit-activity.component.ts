import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';


import { ActivityType, ActivityTypeLabelsList } from '../../../types';
import { Activity } from '../../models/activity.model';
import { Club } from '../../models/club.model';
import { FrDateAdapter } from '../../adapters/fr-date-adapter';
// import { ApolloQueryResult } from '@apollo/client';

@Component({
  selector: 'ky-create-or-edit-activity',
  templateUrl: './create-or-edit-activity.component.html',
  styleUrl: './create-or-edit-activity.component.scss',
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass: FrDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
  imports: [
    FormsModule, ReactiveFormsModule, RouterModule,
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    NgxMatTimepickerModule,
    AsyncPipe,
  ],
})
export class CreateOrEditActivityComponent implements OnInit {
  @Input() club: Club;
  @Input() activity: Activity;

  ActivityTypeLabelsList = ActivityTypeLabelsList;

  activityForm = this._formBuilder.group({
    title: ['', [Validators.required]],
    type: [ActivityType.Kmer, [Validators.required]],
    description: ['', [Validators.required]],
    dates: this._formBuilder.group({
      start: [undefined as Date | undefined, [Validators.required]],
      end: [undefined as Date | undefined, [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    }),
    limit: [0, [Validators.required, Validators.min(0)]],
  });

  sent = false;

  activity$: Observable<Activity> | null = null

  constructor (
    private _formBuilder: NonNullableFormBuilder,
    private apollo: Apollo,
  ) {}

  ngOnInit(): void {
    if (this.activity) {
      this.activityForm.patchValue({
        title: this.activity.title,
        type: this.activity.type,
        description: this.activity.description,
        dates: {
          start: this.activity.start,
          end: this.activity.end,
          startTime: this.activity.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          endTime: this.activity.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
        limit: this.activity.limit,
      });
    }
  }

  transformDate (date: Date, time: string) {
    const newDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);

    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    return newDate;
  }

  transformLimit (limit: number) {
    return limit ? limit : undefined;
  }

  transformForm (data: CreateOrEditActivityComponent['activityForm']['value']) {
    return {
      title: data.title,
      type: data.type,
      description: data.description,
      start: this.transformDate(data.dates!.start!, data.dates!.startTime!),
      end: this.transformDate(data.dates!.end!, data.dates!.endTime!),
      limit: this.transformLimit(data.limit!),
    };
  }

  async onSubmit () {
    this.activityForm.disable();

    this.sent = true;

    if (this.activity) {
      this.activity$ = this.apollo.mutate<{updateActivity: Activity}>({
        mutation: gql`
          mutation UpdateActivity($activityId: ID!, $input: ActivityInput!) {
            updateActivity(activityId: $activityId, input: $input) {
              id title description start end type limit
            }
          }
        `,
        variables: {
          activityId: this.activity.id,
          input: this.transformForm(this.activityForm.value),
        },
      }).pipe(
        map(result => new Activity(result.data!.updateActivity)),
        tap((updateActivity) => {
          this.activity.title = updateActivity.title;
          this.activity.description = updateActivity.description;
          this.activity.start = updateActivity.start;
          this.activity.end = updateActivity.end;
          this.activity.type = updateActivity.type;
          this.activity.limit = updateActivity.limit;
        }),
      );
    } else {
      this.activity$ = this.apollo.mutate<{createActivity: Activity}>({
        mutation: gql`
          mutation CreateActivity($clubId: ID!, $input: ActivityInput!) {
            createActivity(clubId: $clubId, input: $input) {
              id title description start end type limit
            }
          }
        `,
        variables: {
          clubId: this.club.id,
          input: this.transformForm(this.activityForm.value),
        },
      }).pipe(
        map(result => new Activity(result.data!.createActivity)),
      );
    }
  }
}

export default CreateOrEditActivityComponent