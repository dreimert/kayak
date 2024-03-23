import { Component, Input, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

import { Article } from '../../models/article.model';
import { User } from '../../models/user.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ky-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, MatButtonModule, MatButtonToggleModule, MatIconModule,
    AsyncPipe,
    RouterLink,
  ],
})
export class ArticleComponent {
  @Input({ required: true }) article: Article
  @Input() user: User | null
}
