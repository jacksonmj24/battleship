import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

export interface IBox {
  selected?: boolean;
  ships?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public board: Array<Array<IBox>> = [];
  public ships: any = [];
  private defaultBoardElements: any = [
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  ];
  private defaultShips = [
    {name: "", size: 1},
    {name: "", size: 2},
    {name: "", size: 3},
    {name: "", size: 4}
  ];
  firstPlayerGrid: any = {};
  secondPlayerGrid: any = {};

  @ViewChild('cdkBoard', {read: ElementRef, static: false}) boardElement: any;
  public index: number = -1;

  public shipsInBoard: any[] = [];
  position: any
  activePlayer: number = 0;
  gamePlay: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.reset();
    this.activePlayer = 0;
  }

  drop(event: CdkDragDrop<any[]>) {
    event.previousContainer.data[event.previousIndex].top = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0
    event.previousContainer.data[event.previousIndex].left = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    console.log(this.board);
    console.log(this.shipsInBoard);
  }

  saveGrid() {
    // if (!this.ships.length) {
      if (this.activePlayer === 0) {
        this.firstPlayerGrid = {
          board: JSON.parse(JSON.stringify(this.board)),
          shipsInBoard: JSON.parse(JSON.stringify(this.shipsInBoard)),
          ready: true,
          selections: []
        };
        this.activePlayer = 1;
      } else {
        this.secondPlayerGrid = {
          board: JSON.parse(JSON.stringify(this.board)),
          shipsInBoard: JSON.parse(JSON.stringify(this.shipsInBoard)),
          ready: true,
          selections: []
        };
        this.activePlayer = 0;
      }
      if (this.firstPlayerGrid.ready && this.secondPlayerGrid.ready) {
        this.gamePlay = true;
      }
      console.log("data", this.firstPlayerGrid);
      console.log("data", this.secondPlayerGrid);
      this.reset();
    // }
  }

  reset() {
    this.board = JSON.parse(JSON.stringify(this.defaultBoardElements));
    this.ships = JSON.parse(JSON.stringify(this.defaultShips));
    this.shipsInBoard = [];
  }
}
