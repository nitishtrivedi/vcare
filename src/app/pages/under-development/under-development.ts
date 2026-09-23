import { Component, OnDestroy, OnInit } from '@angular/core';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-under-development',
  imports: [],
  templateUrl: './under-development.html',
  styleUrl: './under-development.scss',
})
export class UnderDevelopment implements OnInit, OnDestroy {
  private countdownInterval?: ReturnType<typeof setInterval>;
  ngOnInit(): void {
    this.startCountdown();

    const yearElement = document.getElementById('year');

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
    // September 25, 2026 at 11:59:59 PM
    const launchDate = new Date('2026-09-25T23:59:59').getTime();

    const updateCountdown = (): void => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      const daysElement = document.getElementById('days');
      const hoursElement = document.getElementById('hours');
      const minutesElement = document.getElementById('minutes');
      const secondsElement = document.getElementById('seconds');

      if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
      }

      if (difference <= 0) {
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';

        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }

        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

      const minutes = Math.floor((difference / (1000 * 60)) % 60);

      const seconds = Math.floor((difference / 1000) % 60);

      daysElement.textContent = days.toString().padStart(2, '0');
      hoursElement.textContent = hours.toString().padStart(2, '0');
      minutesElement.textContent = minutes.toString().padStart(2, '0');
      secondsElement.textContent = seconds.toString().padStart(2, '0');
    };

    updateCountdown();

    this.countdownInterval = setInterval(updateCountdown, 1000);
  }
}
