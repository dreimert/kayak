import { Component, Input, OnInit } from '@angular/core';

import { ActivityType, ParticipationType } from '../../../types';
import { MatIconModule } from '@angular/material/icon';
import { ParticipationIconComponent } from '../participation-icon/participation-icon.component';
import { AsyncPipe } from '@angular/common';

import { Activity } from '../../models/activity.model';
import { User } from '../../models/user.model';
import { ActivityIconComponent } from '../activity-icon/activity-icon.component';

@Component({
  selector: 'ky-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
  standalone: true,
  imports: [
    MatIconModule,
    AsyncPipe,
    ParticipationIconComponent, ActivityIconComponent
  ],
})
export class ActivityComponent implements OnInit {
  @Input({ required: true }) activity: Activity
  @Input({ required: true }) user: User

  ActivityType = ActivityType
  ParticipationType = ParticipationType

  participation: ParticipationType

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.participation = this.activity.participations.find(participation => participation.participant.id === this.user.id)?.type || ParticipationType.NonRepondu

    this.activity.recurring = true
  }
}
