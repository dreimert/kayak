import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { User } from '../../models/user.model';
import { Club } from '../../models/club.model';
import { Article } from '../../models/article.model';

@Component({
  selector: 'ky-create-or-edit-article',
  templateUrl: './create-or-edit-article.component.html',
  styleUrl: './create-or-edit-article.component.scss',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, RouterModule,
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    NgxEditorModule,
    AsyncPipe,
  ],
})
export class CreateOrEditArticleComponent implements OnInit, OnDestroy {
  @Input() club: Club;
  @Input({ required: true }) user: User;
  @Input() article: Article;

  articleForm = this._formBuilder.group({
    title: ['', [Validators.required]],
    // author: ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  editor: Editor;
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['format_clear'],
  ];

  sent = false;

  article$: Observable<Article> | null = null

  constructor (
    private _formBuilder: NonNullableFormBuilder,
    private apollo: Apollo,
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();

    if (this.article) {
      this.articleForm.patchValue({
        title: this.article.title,
        // author: this.article.author,
        content: this.article.content,
      });
    // } else {
    //   this.articleForm.patchValue({
    //     author: this.user.name,
    //   });
    }
  }

  async onSubmit () {
    this.articleForm.disable();

    this.sent = true;

    if (this.article) {
      this.article$ = this.apollo.mutate<{updateArticle: Article}>({
        mutation: gql`
          mutation UpdateArticle($articleId: ID!, $input: ArticleInput!) {
            updateArticle(articleId: $articleId, input: $input) {
              id title content
            }
          }
        `,
        variables: {
          articleId: this.article.id,
          input: this.articleForm.value,
        },
      }).pipe(
        map(result => new Article(result.data!.updateArticle)),
        tap((updateArticle) => {
          this.article.title = updateArticle.title;
          // this.article.author = updateArticle.author;
          this.article.content = updateArticle.content;
        }),
      );
    } else {
      this.article$ = this.apollo.mutate<{createArticle: Article}>({
        mutation: gql`
          mutation CreateArticle($clubId: ID!, $input: ArticleInput!) {
            createArticle(clubId: $clubId, input: $input) {
              id title content
            }
          }
        `,
        variables: {
          clubId: this.club.id,
          input: this.articleForm.value,
        },
      }).pipe(
        map(result => new Article(result.data!.createArticle)),
      );
    }
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}