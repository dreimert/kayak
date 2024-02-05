import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe, AsyncPipe } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { AuthService } from '../services/auth.service';
import { Activity, ActivityId, ActivityType, UserId, ParticipationType, User, Agenda, ActivityParticipation } from '../../types';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ParticipationPipe } from '../pipes/participation.pipe';
import { AgendaService } from '../services/agenda.service';

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
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  standalone: true,
  imports: [
    FormsModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatTableModule,
    KeyValuePipe, AsyncPipe, ParticipationPipe
  ]
})
export class ParticipantsComponent {
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
  }[]>

  ParticipationType = ParticipationType
  ActivityType = ActivityType

  participations$: Observable<Participation[]>

  user$: AuthService['user']

  updateAgenda$ = new Subject<void>()

  constructor(private authService: AuthService, private agendaService: AgendaService) {
    this.user$ = authService.user

    this.agenda$ = agendaService.getAgenda()

    this.activites$ = this.agenda$.pipe(
      map(agenda => agenda.activities.sort((a, b) => a.date.getTime() - b.date.getTime())),
      shareReplay(1),
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
        console.log('headers');

        return activities.reduce((acc, activite) => {
          const year = activite.date.getFullYear()
          const month = activite.date.toLocaleString('default', { month: 'long' })
          const day = activite.date.getDay()
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
        console.log('combineLatest');

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
        console.log('totaux');

        const participe = (participation: ActivityParticipation) => participants.find(p => p.id === participation.participant.id)

        return activities.map(activity => {
          const oui = activity.participations.filter(participation => participation.type === ParticipationType.Oui).filter(participe).length
          const peutEtre = activity.participations.filter(participation => participation.type === ParticipationType.PeutEtre).filter(participe).length

          const participation = participations.find(participation => participation.activity === activity.id)

          return {
            activity: activity.id,
            oui: oui + (participation?.type === ParticipationType.Oui ? 1 : 0),
            peutEtre: peutEtre + (participation?.type === ParticipationType.PeutEtre ? 1 : 0)
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

  updateParticipation(participation: Participation) {
    console.log('updateParticipation', participation);

    this.agendaService.participate(participation.activity, this.user$.value?.id!, participation.type).subscribe((res) => {
      console.log('participate', res);
      this.updateAgenda$.next()
    })
  }

  login (user: User) {
    this.authService.login(user)
  }

  signup () {

  }
}
