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
  private activeDragShip: any = {};
  showGrid: boolean = false;
  private actualShipCells: any = [];
  showResult: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.reset();
    this.activePlayer = 0;
    this.showGrid = true;
  }

  drop(event: CdkDragDrop<any[]>) {
    let top = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0;
    let left = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0;
    let currentIndex = this.shipsInBoard.findIndex((shp: any) => shp.id === this.activeDragShip.id);
    let cellsAfterPositioned = this.getActualShipPositions(top, left);
    if (this.checkWithinBoundary(cellsAfterPositioned)) {
      if (currentIndex >= 0) {
        //  TO-DO: Check if valid placement, if the ship is moved within the grid after initial placement
        if (!this.checkIfCollide(top, left)) {
          let cells2 = JSON.parse(JSON.stringify(this.shipsInBoard));
          cells2[currentIndex].top = top;
          cells2[currentIndex].left = left;
          this.shipsInBoard = cells2;
          this.occupiedCells = this.releaseOccupiedCells(this.occupiedCells);
          this.occupiedCells = this.occupiedCells.concat(this.getAllCellPositions(top, left));
          this.actualShipCells = this.releaseOccupiedCells(this.actualShipCells);
          this.actualShipCells = this.actualShipCells.concat(cellsAfterPositioned);
          console.log('actual', this.actualShipCells);
        } else {
          console.log("reset");
        }
      } else {
        // TO-DO: Check if the new ship is placed on top of occupied cells.
        console.log(this.occupiedCells.filter((x: any) => x.top === top && x.left === left));
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
          }
          this.occupiedCells = this.occupiedCells.concat(this.getAllCellPositions(top, left));
          this.actualShipCells = this.actualShipCells.concat(cellsAfterPositioned);
        } else {
          console.log("reset");
        }
      }
    }
    this.activeDragShip = {};
    this.showGrid = false;
    setTimeout(() => {
      this.showGrid = true;
    }, 300);
  }

  checkWithinBoundary(arr: any[]): boolean {
    let a = arr.filter((cell: any) => cell.top < 0 || cell.top > 270 || cell.left < 0 || cell.left > 270);
    return a.length > 0 ? false : true;
  }

  checkIfCollide(top: number, left: number): boolean {
    // TO-DO: To check if the new ship position is not in the occupied cells and return false
    let result = this.occupiedCells.filter((x: any) => x.left === left && x.top === left);
    return result.length ? true : false;
  }

  getActualShipPositions(top: number, left: number) {
    let cells: any = [];
    for (let l = left; l < left + (this.activeDragShip.size * 30); l += 30) {
      cells.push({id: this.activeDragShip.id, top, left: l});
    }
    return cells;
  }

  getAllCellPositions(top: number, left: number) {
    let cells: any = [];
    cells.push({id: this.activeDragShip.id, top, left});
    cells = this.getValues(left, top, this.activeDragShip.size, this.activeDragShip.id)
    return cells;
  }

  getValues(left: number, top: number, size: number, id: string) {
    let c = [];
    let t = top - 30;
    for (let i = 0; i < 3; i++, t += 30) {
      for (let j = left - 30; j <= (left + (30 * size)); j += 30) {
        if (t <= 270 && t >= 0 && j <= 270 && j >= 0) {
          c.push({id, top: t, left: j})
        }
      }
    }
    return c;
  }


  saveGrid() {
    if (!this.ships.length) {
      if (this.activePlayer === 0) {
        this.firstPlayerGrid = {
          board: JSON.parse(JSON.stringify(this.board)),
          shipsInBoard: JSON.parse(JSON.stringify(this.actualShipCells)),
          ready: true,
          selections: [],
          player: 0
        };
        this.activePlayer = 1;
      } else {
        this.secondPlayerGrid = {
          board: JSON.parse(JSON.stringify(this.board)),
          shipsInBoard: JSON.parse(JSON.stringify(this.actualShipCells)),
          ready: true,
          selections: [],
          player: 1
        };
        this.activePlayer = 0;
      }
      if (this.firstPlayerGrid.ready && this.secondPlayerGrid.ready) {
        this.gamePlay = true;
      }
      this.reset();
    }
  }

  reset() {
    this.board = JSON.parse(JSON.stringify(this.defaultBoardElements));
    this.ships = JSON.parse(JSON.stringify(this.defaultShips));
    this.shipsInBoard = [];
    this.activeDragShip = {};
    this.occupiedCells = [];
    this.actualShipCells = [];
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
      if (event.payload['selections'].filter((x: any) => x.type === 'hit').length === event.payload['shipsInBoard'].length) {
        console.log(this.activePlayer + " won!!!");
        this.showResult = true;
      } else {
        this.activePlayer = event.payload.player === 0 ? 0 : 1;
      }
    }
  }

  setActiveShip(ship: any) {
    console.log(ship);
    this.activeDragShip = ship;
  }

  private releaseOccupiedCells(cells: any[]) {
    let indexes: any = [];
    cells.forEach((x: any, i: number) => {
      if (x.id === this.activeDragShip.id) {
        indexes.push(i);
      }
    });
    for (let i = indexes.length - 1; i >= 0; i--)
      cells.splice(indexes[i], 1);
    return cells;
  }
}
