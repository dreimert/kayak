import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditArticleComponent } from './create-or-edit-article.component';

describe('CreateOrEditArticleComponent', () => {
  let component: CreateOrEditArticleComponent;
  let fixture: ComponentFixture<CreateOrEditArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrEditArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrEditArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
