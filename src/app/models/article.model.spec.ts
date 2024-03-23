import { Article } from './article.model';

describe('Article', () => {
  it('should create an instance', () => {
    expect(new Article({
      id: '1',
    })).toBeTruthy();
  });
});
