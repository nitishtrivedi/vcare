import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../../../models/blog.model';
import { AuthService } from '../../../../services/auth';
import { BlogService } from '../../../../services/blog';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList implements OnInit {
  readonly blogs = signal<Blog[]>([]);

  readonly isLoading = signal(true);

  readonly errorMessage = signal('');

  readonly deletingId = signal<number | null>(null);

  constructor(
    private readonly blogService: BlogService,
    private readonly authService: AuthService,
  ) {}

  resolveImageUrl(path: string | null): string | null {
    return this.blogService.resolveImageUrl(path);
  }
  async ngOnInit(): Promise<void> {
    await this.loadBlogs();
  }

  async loadBlogs(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const blogs = await this.blogService.getBlogs();

      this.blogs.set(blogs);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load blogs.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteBlog(blog: Blog): Promise<void> {
    const confirmed = window.confirm(`Delete "${blog.title}"?\n\nThis cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.deletingId.set(blog.id);

    try {
      await this.blogService.deleteBlog(blog.id);

      this.blogs.update((items) => items.filter((item) => item.id !== blog.id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to delete the blog.');
    } finally {
      this.deletingId.set(null);
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();

    window.location.href = '/admin/login';
  }

  formatDate(dateValue: string): string {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
}
