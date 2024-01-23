import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

type DisplayableHeader = {
  key: string;
  display: string;
  quantity: number;
}

enum ActivityType {
  Kmer,
  Piscine,
  EauVive,
  Slalom,
  Musculation
}

enum ParticipationType {
  Oui = 'oui',
  Non = 'non',
  PeutEtre = 'peutEtre',
  NonRepondu = 'unknown',
}

type Activity = {
  id: number
  date: Date
  type: ActivityType
}

type Participants = {
  id: number;
  name: string;
  email: string;
  phone: string;
  participations: {
    id: number,
    type: ParticipationType
  }[];
}

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  standalone: true,
  imports: [FormsModule, MatButtonToggleModule, MatIconModule, MatTableModule, KeyValuePipe]
})
export class ParticipantsComponent {
  activites: Activity[] = [{
    id: 1,
    date: new Date(2024, 0, 16, 19, 30),
    type: ActivityType.Musculation
  }, {
    id: 2,
    date: new Date(2024, 0, 19, 20, 30),
    type: ActivityType.Piscine
  }, {
    id: 3,
    date: new Date(2024, 0, 20, 8, 30),
    type: ActivityType.Kmer
  }, {
    id: 4,
    date: new Date(2024, 0, 20, 8),
    type: ActivityType.EauVive
  }, {
    id: 5,
    date: new Date(2024, 0, 20, 13, 30),
    type: ActivityType.Kmer
  }, {
    id: 6,
    date: new Date(2024, 0, 23, 19, 30),
    type: ActivityType.Musculation
  }, {
    id: 7,
    date: new Date(2024, 0, 26, 20, 30),
    type: ActivityType.Piscine
  }, {
    id: 8,
    date: new Date(2024, 0, 27, 8, 30),
    type: ActivityType.Kmer
  }, {
    id: 8,
    date: new Date(2024, 0, 27, 8),
    type: ActivityType.EauVive
  }, {
    id: 9,
    date: new Date(2024, 0, 27, 13, 30),
    type: ActivityType.Kmer
  }]

  months: DisplayableHeader[]
  days: DisplayableHeader[]
  hours: DisplayableHeader[]

  participants: Participants[] = [{
    id: 1,
    name: 'Jean Dupond',
    email: 'j.d@mail.com',
    phone: '06 07 08 09 09',
    participations: [{
      id: 1,
      type: ParticipationType.Oui,
    }, {
      id: 2,
      type: ParticipationType.Non,
    }, {
      id: 3,
      type: ParticipationType.PeutEtre,
    }, {
      id: 5,
      type: ParticipationType.Oui,
    }]
  }, {
    id: 2,
    name: 'Martin',
    email: 'j.d@mail.com',
    phone: '06 07 08 09 09',
    participations: [{
      id: 1,
      type: ParticipationType.Oui,
    }, {
      id: 2,
      type: ParticipationType.Non,
    }, {
      id: 3,
      type: ParticipationType.PeutEtre,
    }, {
      id: 5,
      type: ParticipationType.Oui,
    }]
  }, {
    id: 3,
    name: 'Roro',
    email: 'j.d@mail.com',
    phone: '06 07 08 09 09',
    participations: [{
      id: 1,
      type: ParticipationType.Oui,
    }, {
      id: 2,
      type: ParticipationType.Non,
    }, {
      id: 3,
      type: ParticipationType.PeutEtre,
    }, {
      id: 5,
      type: ParticipationType.Oui,
    }]
  }, {
    id: 4,
    name: 'DD',
    email: 'j.d@mail.com',
    phone: '06 07 08 09 09',
    participations: [{
      id: 1,
      type: ParticipationType.Oui,
    }, {
      id: 2,
      type: ParticipationType.Non,
    }, {
      id: 3,
      type: ParticipationType.PeutEtre,
    }, {
      id: 5,
      type: ParticipationType.Oui,
    }]
  }, {
    id: 5,
    name: 'JP',
    email: 'j.d@mail.com',
    phone: '06 07 08 09 09',
    participations: [{
      id: 1,
      type: ParticipationType.Oui,
    }, {
      id: 2,
      type: ParticipationType.Non,
    }, {
      id: 3,
      type: ParticipationType.PeutEtre,
    }, {
      id: 5,
      type: ParticipationType.Oui,
    }]
  }]

  ParticipationType = ParticipationType
  ActivityType = ActivityType

  participations: {
    id: number,
    type: ParticipationType
  }[]

  constructor() {
    this.activites.sort((a: Activity, b: Activity) => a.date.getTime() - b.date.getTime())

    const { months, days, hours } = this.activites.reduce((acc, activite) => {
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

    this.months = months
    this.days = days
    this.hours = hours

    this.participations = this.activites.map(activity => {
      return {
        id: activity.id,
        type: ParticipationType.NonRepondu
      }
    })
  }

  findParticipation(activity: Activity, participant: Participants): ParticipationType {
    const participation = participant.participations.find(participation => participation.id === activity.id)

    if (participation) {
      return participation.type
    }

    return ParticipationType.NonRepondu
  }
}
