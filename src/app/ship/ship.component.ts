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
  styles: [`
    .ship-box {
      position: relative;
      height: 30px;
      z-index: 100
    }

    .ship-drop-wrapper {
      position: absolute;
      top: 0;
    }

    .ship-box-cell {
      width: 30px;
      height: 30px;
      display: inline-block;
    }

    .cell-bg {
      border: 1px solid #46efd7;
      background-color: #46efd7;
    }

    .t-hit {
      border: 1px solid #ec0328;
      background-color: #f90858;
    }

    .t-miss {
      border: 1px solid #6d6d6d;
      background-color: #6d6d6d;
    }

    .ship-box-cell:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    .ship-box-cell:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  `]
})
export class ShipComponent {
  @Input() name: string = '';
  @Input() size: number = 0;
  @Input() type: string = '';

  index: number = -1
}
