import { Component, Input, OnInit } from '@angular/core';

import { ActivityType, ParticipationType, ParticipationTypeLabelsList } from '../../../types';
import { MatIconModule } from '@angular/material/icon';
import { ParticipationIconComponent } from '../participation-icon/participation-icon.component';
import { AsyncPipe } from '@angular/common';

import { Activity } from '../../models/activity.model';
import { User } from '../../models/user.model';
import { ActivityIconComponent } from '../activity-icon/activity-icon.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ky-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatButtonModule, MatButtonToggleModule, MatIconModule,
    AsyncPipe,
    RouterLink,
    ParticipationIconComponent, ActivityIconComponent
  ],
})
export class ActivityComponent implements OnInit {
  @Input({ required: true }) activity: Activity
  @Input() user: User | null

  ActivityType = ActivityType
  ParticipationType = ParticipationType
  ParticipationTypeLabelsList = ParticipationTypeLabelsList

  participation: ParticipationType
  others: Activity['participations']
  total: {
    ouiLike: number,
    peutEtre: number,
  }

  ngOnInit(): void {
    this.participation = this.activity.participations.find(participation => participation.participant.id === this.user?.id)?.type || ParticipationType.NonRepondu
    this.others = this.activity.participations.filter(participation => participation.participant.id !== this.user?.id)
    this.total = this.activity.getParticipationSum()
  }

  participate(participation: ParticipationType) {
    this.activity.participate(this.user!.id, participation).subscribe((res) => {
      this.total = this.activity.getParticipationSum()
    })
  }

export default ActivityComponent;