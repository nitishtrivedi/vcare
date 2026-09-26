import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-under-maintenance',
  imports: [],
  templateUrl: './under-maintenance.html',
  styleUrl: './under-maintenance.scss',
})
export class UnderMaintenance implements OnDestroy {
  readonly year = new Date().getFullYear();

  // ============================================================
  // CHANGE ONLY THIS DATE/TIME TO CONTROL THE COUNTDOWN
  // Format: YYYY-MM-DDTHH:mm:ss+05:30
  // ============================================================
  readonly maintenanceEndTime = '2026-09-27T01:00:00+05:30';

  readonly countdown = signal({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  private readonly maintenanceEndsAt = new Date(this.maintenanceEndTime).getTime();

  private countdownTimer?: ReturnType<typeof setInterval>;

  constructor() {
    this.updateCountdown();

    this.countdownTimer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  private updateCountdown(): void {
    const remaining = Math.max(0, this.maintenanceEndsAt - Date.now());

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.countdown.set({
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    });
  }
}
