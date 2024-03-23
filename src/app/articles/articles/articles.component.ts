import { Component, Input } from '@angular/core';

import { Article } from '../../models/article.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ky-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
  standalone: true,
  imports: [
    RouterLink,
  ],
})
export class ArticlesComponent {
  @Input({ required: true }) articles: Article[]
  // @Input() user: User | null
}
