import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Blog as BlogItem } from '../../../models/blog.model';
import { ScrollReveal } from '../../../directives/scroll-reveal';
import { BlogService } from '../../../services/blog';

@Component({
  selector: 'app-article',
  imports: [RouterLink, ScrollReveal],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article implements OnInit {
  readonly blog = signal<BlogItem | null>(null);

  readonly isLoading = signal(true);

  readonly errorMessage = signal('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly blogService: BlogService,
  ) {}

  resolveImageUrl(path: string | null): string | null {
    return this.blogService.resolveImageUrl(path);
  }
  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.errorMessage.set('Article not found.');

      this.isLoading.set(false);

      return;
    }

    try {
      const blog = await this.blogService.getBlogBySlug(slug);

      if (!blog) {
        this.errorMessage.set('Article not found.');

        return;
      }

      this.blog.set(blog);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Unable to load this article.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
}
