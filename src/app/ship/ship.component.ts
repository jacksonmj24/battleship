import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ship',
  template: `
    <div class="ship-box" [style.width]="30*size+'px'">
      {{name}}
      <div class="ship-drop-wrapper">
        <div *ngFor="let i of [0,1,2,3,4].slice(0,size)" class="ship-box-cell"
             [ngClass]="{ 't-miss': type === 'miss', 't-hit': type === 'hit', 'cell-bg': !type}"
             (mouseover)="index=i">
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ship.component.css']
})
export class ShipComponent {
  @Input() name: string = '';
  @Input() size: number = 0;
  @Input() type: string = '';

  index: number = -1
}
