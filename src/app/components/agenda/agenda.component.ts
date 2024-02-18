import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, AsyncPipe } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ActivityType, ParticipationType, ActivityParticipation } from '../../../types';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ParticipationPipe } from '../../pipes/participation.pipe';
import { AgendaService } from '../../services/agenda.service';
import { RouterLink } from '@angular/router';
import { ShowUserDataDialog } from '../../dialogs/show-user-data/show-user-data.dialog';
import { ConfirmShowUserDataDialog } from '../../dialogs/confirm-show-user-data/confirm-show-user-data.dialog';
import { UserService } from '../../services/user.service';
import { ParticipationIconComponent } from '../participation-icon/participation-icon.component';

import { Activity, ActivityId } from '../../models/activity.model';
import { User, UserPartial } from '../../models/user.model';
import { Agenda } from '../../models/agenda.model';
import { ActivityIconComponent } from '../activity-icon/activity-icon.component';

type DisplayableHeader = {
  key: string;
  display: string;
  quantity: number;
}

type Participation = {
  activity: ActivityId,
  type: ParticipationType
}
function isLikeOui (participation: ParticipationType) {
  switch (participation) {
    case ParticipationType.Oui:
    case ParticipationType.Coordinator:
    case ParticipationType.Security:
      return true
    default:
      return false
  }
}

@Component({
  selector: 'ky-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatTableModule, MatSelectModule,
    KeyValuePipe, AsyncPipe, ParticipationPipe,
    RouterLink,
    ParticipationIconComponent, ActivityIconComponent
  ]
})
export class AgendaComponent implements OnInit {
  @Input({ required: true }) agenda: Agenda
  @Input() user: User | null = null

  ParticipationType = ParticipationType
  ActivityType = ActivityType

  activites$: Observable<Activity[]>

  headers$: Observable<{
    months: DisplayableHeader[],
    days: DisplayableHeader[],
    hours: DisplayableHeader[]
  }>

  authUserParticipations$: Observable<Participation[]>

  othersUserParticipations$: Observable<(UserPartial & {
    participations: ParticipationType[]
  })[]>

  totaux$: Observable<{
    activity: ActivityId,
    ouiLike: number,
    peutEtre: number,
  }[]>

  updateAgenda$ = new Subject<void>()

  filters = [{
    name: 'Aucun',
    filter: (activity: Activity) => true
  }, {
    name: 'Eau vive',
    filter: (activity: Activity) => activity.type === ActivityType.EauVive
  }, {
    name: 'Musculation',
    filter: (activity: Activity) => activity.type === ActivityType.Musculation
  }, {
    name: 'Piscine',
    filter: (activity: Activity) => activity.type === ActivityType.Piscine
  }, {
    name: 'Randonnée',
    filter: (activity: Activity) => activity.type === ActivityType.Kmer
  }, {
    name: 'Slalom',
    filter: (activity: Activity) => activity.type === ActivityType.Slalom
  }]

  filter = new FormControl(this.filters[0]);

  constructor(
    private dialog: MatDialog,
    private agendaService: AgendaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.agenda.activities.sort((a, b) => a.date.getTime() - b.date.getTime())
    this.agenda.participants = this.agenda.participants.filter(participant => participant.id !== this.user?.id)

    // this.agenda$ = agendaService.getAgenda()

    this.activites$ = this.filter.valueChanges.pipe(
      startWith(this.filters[0]),
      map(filter => this.agenda.activities.filter(filter!.filter))
    )

    this.headers$ = this.activites$.pipe(
      map(activities => {
        return activities.reduce((acc, activite) => {
          const year = activite.date.getFullYear()
          const month = activite.date.toLocaleString('default', { month: 'long' })
          const day = activite.date.getDate()
          const weekday = activite.date.toLocaleString('default', { weekday: 'short'})
          const hour = activite.date.getHours()
          const minute = activite.date.getMinutes().toString().padStart(2, '0')

          const displayMonth = `${month} ${year}`
          const lastMonth = acc['months'].at(-1)

          if (!lastMonth) {
            acc['months'].push({
              key: displayMonth,
              display: displayMonth,
              quantity: 1
            })
          } else if (lastMonth.display === displayMonth) {
            lastMonth.quantity++
          } else {
            acc['months'].push({
              key: displayMonth,
              display: displayMonth,
              quantity: 1
            })
          }

          const displayDay = `${weekday} ${day}`
          const keyDay = `${displayMonth} ${displayDay}`
          const lastDay = acc['days'].at(-1)

          if (!lastDay) {
            acc['days'].push({
              key: keyDay,
              display: displayDay,
              quantity: 1
            })
          } else if (lastDay.key === keyDay) {
            lastDay.quantity++
          } else {
            acc['days'].push({
              key: keyDay,
              display: displayDay,
              quantity: 1
            })
          }

          const displayHour = `${hour}:${minute}`
          const keyHour = `${displayDay} ${displayHour}`
          const lastHour = acc['hours'].at(-1)

          if (!lastHour) {
            acc['hours'].push({
              key: keyHour,
              display: displayHour,
              quantity: 1
            })
          } else if (lastHour.key === keyHour) {
            lastHour.quantity++
          } else {
            acc['hours'].push({
              key: keyHour,
              display: displayHour,
              quantity: 1
            })
          }

          return acc
        }, {months: [] as DisplayableHeader[], days: [] as DisplayableHeader[], hours: [] as DisplayableHeader[]})
      }),
      shareReplay(1),
    )

    this.authUserParticipations$ = this.activites$.pipe(
      map((activities) => {
        return activities.map(activity => {
          const find = activity.participations.find(participation => this.user?.id === participation.participant.id)

          return {
            activity: activity.id,
            type: find?.type ?? ParticipationType.NonRepondu
          }
        })
      }),
      shareReplay(1),
    )

    this.othersUserParticipations$ = this.activites$.pipe(
      map((activities) => {
        return this.agenda.participants.map(participant => {
          return {
            ...participant,
            participations: activities.map(activity => {
              const find = activity.participations.find(participation => participant.id === participation.participant.id)

              return find?.type ?? ParticipationType.NonRepondu
            })
          }
        })
      }),
      shareReplay(1),
    )

    this.totaux$ = combineLatest({
      activities: this.activites$,
      participations: this.authUserParticipations$,
      updateAgenda: this.updateAgenda$.pipe(startWith(''))
    }).pipe(
      map(({activities, participations}) => {
        // const participe = (participation: ActivityParticipation) => this.agenda.participants.find(p => p.id === participation.participant.id)

        return activities.map(activity => {
          return {
            activity: activity.id,
            ...activity.getParticipationSum()
          }
        })
      }),
      shareReplay(1),
    )

    // this.activites$.subscribe(activites => {
    //   activites.forEach(activite => {
    //     activite.participations = []
    //   })

    //   this.participants.forEach(participant => {
    //     participant.participations.forEach(participation => {
    //       const index = activites.findIndex(activite => activite.id === participation.activity)

    //       if (index !== -1) {
    //         activites[index].participations!.push({
    //           participant: participant.id,
    //           type: participation.type
    //         })
    //       }
    //     })
    //   })
    // })
  }

  findParticipation(activity: Activity, participant: UserPartial): ParticipationType {
    const participation = activity.participations.find(participation => participation.participant.id === participant.id)

    if (participation) {
      return participation.type
    }

    return ParticipationType.NonRepondu
  }

  async updateParticipation(participation: Participation) {
    const activity = this.agenda.activities.find(activity => activity.id === participation.activity)

    activity!.participate(this.user!.id!, participation.type).subscribe((res) => {
      this.updateAgenda$.next()
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