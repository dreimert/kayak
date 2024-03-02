import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ParticipationType, ParticipationTypeToIcon } from '../../../types';

@Component({
  selector: 'ky-participation-icon',
  templateUrl: './participation-icon.component.html',
  styleUrl: './participation-icon.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class ParticipationIconComponent {
  @Input({ required: true }) type: ParticipationType

  ParticipationTypeToIcon = ParticipationTypeToIcon
}
