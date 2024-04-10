import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { ActivityType, ID, ParticipationType, ParticipationTypeLabelsList } from '../../../types';
import { MatIconModule } from '@angular/material/icon';
import { ParticipationIconComponent } from '../participation-icon/participation-icon.component';
import { AsyncPipe } from '@angular/common';

import { Activity } from '../../models/activity.model';
import { User, UserPartial } from '../../models/user.model';
import { ActivityIconComponent } from '../activity-icon/activity-icon.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { ShowUserDataDialog } from '../../dialogs/show-user-data/show-user-data.dialog';
import { ConfirmShowUserDataDialog } from '../../dialogs/confirm-show-user-data/confirm-show-user-data.dialog';
import { LegendComponent } from '../legend/legend.component';
import { isLikeOui } from '../agenda/agenda.component';

@Component({
  selector: 'ky-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatButtonModule, MatButtonToggleModule, MatIconModule,
    AsyncPipe,
    RouterLink,
    ActivityIconComponent, LegendComponent, ParticipationIconComponent,
  ],
})
export class ActivityComponent implements OnInit {
  @Input({ required: true }) activity: Activity
  @Input() user: User | null

  ActivityType = ActivityType
  ParticipationType = ParticipationType
  ParticipationTypeLabelsList = ParticipationTypeLabelsList

  participation: ParticipationType
  participationIndex: number
  participantLimit: ID
  others: Activity['participations']
  total: {
    ouiLike: number,
    peutEtre: number,
  }

  isLikeOui = isLikeOui

  constructor(
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const participations = this.activity.participations
      .map(participation => ({
        ...participation,
        lastUpdate: new Date(participation.lastUpdate),
        participant: {
          ...participation.participant,
          paddles: participation.participant.paddles.filter(paddle => paddle.activityType === this.activity.type)
        }
      }))
      .sort((a, b) => {
        if (isLikeOui(a.type) && !isLikeOui(b.type)) {
          return -1
        } else if (!isLikeOui(a.type) && isLikeOui(b.type)) {
          return 1
        } else {
          return a.lastUpdate.getTime() - b.lastUpdate.getTime()
        }
      })

    this.participation = this.activity.participations.find(participation => participation.participant.id === this.user?.id)?.type || ParticipationType.NonRepondu
    this.participationIndex = participations.findIndex(participation => participation.participant.id === this.user?.id)
    this.others = participations.filter(participation => participation.participant.id !== this.user?.id)
    this.total = this.activity.getParticipationSum()

    if (this.activity.limit && this.total.ouiLike >= this.activity.limit) {
      this.participantLimit = participations[this.activity.limit - 1].participant.id
    }
  }

  participate(participation: ParticipationType) {
    this.activity.participate(this.user!.id, participation).subscribe((res) => {
      this.total = this.activity.getParticipationSum()
    })
  }

  showData (user: UserPartial, type: 'phone' | 'email') {
    const dialogRef = this.dialog.open(ConfirmShowUserDataDialog, {
      data: {
        user,
        type
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      this.userService.data(user.id, type).pipe(
        map(data => {
          return this.dialog.open(ShowUserDataDialog, {
            data: {
              user,
              data,
              type
            }
          }).afterClosed();
        })
      ).subscribe(result => {});
    });
  }
}

export default ActivityComponent;