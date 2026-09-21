import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  get currentUser() {
    return this.authService.currentUser();
  }

  constructor(private readonly authService: AuthService) {}

  async logout(): Promise<void> {
    await this.authService.logout();

    window.location.href = '/admin/login';
  }
}
