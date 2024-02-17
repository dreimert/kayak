import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ActivityType } from '../../../types';

@Component({
  selector: 'ky-activity-icon',
  templateUrl: './activity-icon.component.html',
  styleUrl: './activity-icon.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class ActivityIconComponent {
  @Input({ required: true }) type: ActivityType

  ActivityType = ActivityType
}
