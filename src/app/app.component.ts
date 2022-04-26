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
    {name: "", size: 1, id: 's1'},
    {name: "", size: 1, id: 's2'},
    {name: "", size: 2, id: 's3'},
    {name: "", size: 3, id: 's4'},
    {name: "", size: 4, id: 's5'}
  ];
  firstPlayerGrid: any = {};
  secondPlayerGrid: any = {};

  @ViewChild('cdkBoard', {read: ElementRef, static: false}) boardElement: any;
  public index: number = -1;

  public shipsInBoard: any[] = [];
  position: any
  activePlayer: number = 0;
  gamePlay: boolean = false;
  occupiedCells: any = [];

  constructor() {
  }

  ngOnInit() {
    this.reset();
    this.activePlayer = 0;
  }

  drop(event: CdkDragDrop<any[]>) {
    let top = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0;
    let left = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0;
    if (this.occupiedCells.filter((x: any) => x.top === top && x.left === left).length === 0) {
      event.previousContainer.data[event.previousIndex].top = top;
      event.previousContainer.data[event.previousIndex].left = left;
      if (event.previousContainer !== event.container) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        // moveItemInArray(
        //   event.container.data,
        //   event.previousIndex,
        //   event.currentIndex
        // );
      }
      this.occupiedCells = this.occupiedCells.concat({top, left});
    } else {
      console.log("reset");
    }
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
