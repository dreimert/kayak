import { Pipe, PipeTransform } from '@angular/core';

import { ParticipationType } from '../../types';

@Pipe({
  name: 'participation',
  standalone: true
})
export class ParticipationPipe implements PipeTransform {

  transform(value: { type: ParticipationType }[] | undefined, type: ParticipationType = ParticipationType.Oui): { type: ParticipationType }[] {
    return (value || []).filter(participation => participation.type === type)
  }

}