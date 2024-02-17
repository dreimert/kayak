import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, AsyncPipe } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../services/auth.service';
import { Activity, ActivityId, ActivityType, ParticipationType, User, Agenda, ActivityParticipation } from '../../../types';
import { Observable, Subject, combineLatest, firstValueFrom } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ParticipationPipe } from '../../pipes/participation.pipe';
import { AgendaService } from '../../services/agenda.service';
import { RouterLink } from '@angular/router';
import { ShowUserDataDialog } from '../../dialogs/show-user-data/show-user-data.dialog';
import { ConfirmShowUserDataDialog } from '../../dialogs/confirm-show-user-data/confirm-show-user-data.dialog';
import { UserService } from '../../services/user.service';

type DisplayableHeader = {
  key: string;
  display: string;
  quantity: number;
}

type Participation = {
  activity: ActivityId,
  type: ParticipationType
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
  ]
})
export class AgendaComponent {
  agenda$: Observable<Agenda>
  activites$: Observable<Activity[]>
  participants$: Observable<User[]>

  headers$: Observable<{
    months: DisplayableHeader[],
    days: DisplayableHeader[],
    hours: DisplayableHeader[]
  }>

  totaux$: Observable<{
    activity: ActivityId,
    oui: number,
    peutEtre: number,
    coordinator: number
  }[]>

  ParticipationType = ParticipationType
  ActivityType = ActivityType

  participations$: Observable<Participation[]>

  user$: AuthService['user$']

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
    private authService: AuthService,
    private agendaService: AgendaService,
    private userService: UserService
  ) {
    this.user$ = authService.user$

    this.agenda$ = agendaService.getAgenda()

    this.activites$ = combineLatest({
      activites: this.agenda$.pipe(
        map(agenda => agenda.activities.sort((a, b) => a.date.getTime() - b.date.getTime())),
        shareReplay(1),
      ),
      filter: this.filter.valueChanges.pipe(startWith(this.filters[0]))
    }).pipe(
      map(({ activites, filter }) => activites.filter(filter!.filter))
    )

    this.participants$ = combineLatest({
      user: this.user$,
      agenda: this.agenda$
    }).pipe(
      map(({ user, agenda }) => agenda.participants.filter(participant => participant.id !== user?.id)),
      shareReplay(1),
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

    // TODO: get user from auth service
    this.participations$ = combineLatest({
      user: this.user$,
      activities: this.activites$
    }).pipe(
      map(({user, activities}) => {
        return activities.map(activity => {
          const find = activity.participations.find(participation => user?.id === participation.participant.id)

          return {
            activity: activity.id,
            type: find?.type ?? ParticipationType.NonRepondu
          }
        })
      }),
      shareReplay(1),
    )

    this.totaux$ = combineLatest({
      participants: this.participants$,
      activities: this.activites$,
      participations: this.participations$,
      updateAgenda: this.updateAgenda$.pipe(startWith(''))
    }).pipe(
      map(({participants, activities, participations}) => {
        const participe = (participation: ActivityParticipation) => participants.find(p => p.id === participation.participant.id)

        return activities.map(activity => {
          const oui = activity.participations.filter(participation => participation.type === ParticipationType.Oui).filter(participe).length
          const peutEtre = activity.participations.filter(participation => participation.type === ParticipationType.PeutEtre).filter(participe).length
          const coordinator = activity.participations.filter(participation => participation.type === ParticipationType.Coordinator).filter(participe).length

          const participation = participations.find(participation => participation.activity === activity.id)

          return {
            activity: activity.id,
            oui: oui + (participation?.type === ParticipationType.Oui ? 1 : 0),
            peutEtre: peutEtre + (participation?.type === ParticipationType.PeutEtre ? 1 : 0),
            coordinator: coordinator + (participation?.type === ParticipationType.Coordinator ? 1 : 0),
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

  findParticipation(activity: Activity, participant: User): ParticipationType {
    const participation = activity.participations.find(participation => participation.participant.id === participant.id)

    if (participation) {
      return participation.type
    }

    return ParticipationType.NonRepondu
  }

  async updateParticipation(participation: Participation) {
    const user = await firstValueFrom(this.user$)

    this.agendaService.participate(participation.activity, user!.id!, participation.type).subscribe((res) => {
      this.updateAgenda$.next()
    })
  }

  showData (user: User, type: 'phone' | 'email') {
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