import { Component } from '@angular/core';

@Component({
  selector: 'app-under-maintenance',
  imports: [],
  templateUrl: './under-maintenance.html',
  styleUrl: './under-maintenance.scss',
})
export class UnderMaintenance {
  readonly year = new Date().getFullYear();
}
