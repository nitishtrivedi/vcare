import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wave-divider',
  imports: [],
  templateUrl: './wave-divider.html',
  styleUrl: './wave-divider.scss',
})
export class WaveDivider {
  @Input() fill: string = '#FBED21';
  @Input() flip: boolean = false;
}
