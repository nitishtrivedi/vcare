import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  username = '';
  password = '';

  readonly isSubmitting = signal(false);

  readonly errorMessage = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const authenticated = await this.authService.restoreSession();

    if (authenticated) {
      await this.router.navigate(['/admin']);
    }
  }

  async submit(): Promise<void> {
    this.errorMessage.set('');

    const username = this.username.trim();

    if (!username || !this.password) {
      this.errorMessage.set('Enter your username and password.');

      return;
    }

    this.isSubmitting.set(true);

    try {
      const result = await this.authService.login(username, this.password);

      if (!result.success || !result.user) {
        this.errorMessage.set(result.message ?? 'Incorrect username or password.');

        return;
      }

      this.password = '';

      await this.router.navigate(['/admin']);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Unable to contact the login server.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
