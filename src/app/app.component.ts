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
    if (this.checkValidDrop())
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

  checkValidDrop() {
    //  The ship should not be placed on top of other ships
    //  The ships should not be placed to the nearest cells around the ship.
    let y = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0;
    let x = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0;

    console.log(this.shipsInBoard);
    return true;
  }

  saveGrid() {
    if (!this.ships.length) {
      if (this.activePlayer === 0) {
        this.firstPlayerGrid = {
          board: JSON.parse(JSON.stringify(this.board)),
          shipsInBoard: JSON.parse(JSON.stringify(this.shipsInBoard)),
          ready: true,
          selections: [],
          player: 0
        };
        this.activePlayer = 1;
      } else {
        this.secondPlayerGrid = {
          board: JSON.parse(JSON.stringify(this.board)),
          shipsInBoard: JSON.parse(JSON.stringify(this.shipsInBoard)),
          ready: true,
          selections: [],
          player: 1
        };
        this.activePlayer = 0;
      }
      if (this.firstPlayerGrid.ready && this.secondPlayerGrid.ready) {
        this.gamePlay = true;
      }
      console.log("data", this.firstPlayerGrid);
      console.log("data", this.secondPlayerGrid);
      this.reset();
    }
  }

  reset() {
    this.board = JSON.parse(JSON.stringify(this.defaultBoardElements));
    this.ships = JSON.parse(JSON.stringify(this.defaultShips));
    this.shipsInBoard = [];
    // {"name": "", "size": 1, "top": 0, "left": 0},
    // {"name": "", "size": 1, "top": 0, "left": 60},
    // {"name": "", "size": 2, "top": 0, "left": 120},
    // {"name": "", "size": 3, "top": 0, "left": 210},
    // {"name": "", "size": 4, "top": 60.00000762939453, "left": 0}
  }

  cancelGame() {
    this.activePlayer = 0;
    this.gamePlay = false;
    this.firstPlayerGrid = {};
    this.secondPlayerGrid = {};
    this.reset();
  }

  handleEvent(event: any) {
    if (event && event.status === 'completed') {
      this.activePlayer = event.payload.player === 0 ? 1 : 0;
    }
  }
}
