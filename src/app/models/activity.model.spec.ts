import { ActivityType } from '../../types';
import { Activity } from './activity.model';

describe('Activity', () => {
  it('should create an instance', () => {
    expect(new Activity({
      id: '1',
      type: ActivityType.Kmer,
      start: new Date(),
      end: new Date(),
      participations: []
    })).toBeTruthy();
  });
});
