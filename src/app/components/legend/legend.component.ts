import { Component } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { ActivityTypeLabelsList, ParticipationTypeLabelsList } from '../../../types';

@Component({
  selector: 'ky-legend',
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.scss',
  standalone: true,
  imports: [
    MatIconModule,
  ],
})
export class LegendComponent {
  ActivityTypeLabelsList = ActivityTypeLabelsList
  ParticipationTypeLabelsList = ParticipationTypeLabelsList
}
