import {Component} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'battleship';
  n: number = 10;
  m: number = 10;

  shipsConfig: any = [
    {
      type: 'v',
      c: 4
    },
    {
      type: 'v',
      c: 3
    },
    {
      type: 'v',
      c: 2
    },
    {
      type: 'h',
      c: 4
    },
    {
      type: 'h',
      c: 3
    },
    {
      type: 'h',
      c: 2
    },
    {
      type: 'h',
      c: 1
    },
    {
      type: 'h',
      c: 1
    },
  ]

  drop(event: CdkDragDrop<any>) {
    console.log(event);
    // this.items[event.previousContainer.data.index] = event.container.data.item;
    // this.items[event.container.data.index] = event.previousContainer.data.item;
  }
}
