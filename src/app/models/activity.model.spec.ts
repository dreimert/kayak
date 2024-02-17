import { ActivityType } from '../../types';
import { Activity } from './activity.model';

describe('Activity', () => {
  it('should create an instance', () => {
    expect(new Activity({
      id: '1',
      type: ActivityType.Kmer,
      date: new Date(),
      participations: []
    })).toBeTruthy();
  });
});
