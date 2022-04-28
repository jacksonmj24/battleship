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
    if (currentIndex >= 0) {
      //  TO-DO: Check if valid placement, if the ship is moved within the grid after initial placement
      let possibleCells = this.getAllCellPositions(top, left);
      if (!this.checkIfCollide(possibleCells, this.occupiedCells)) {
        let cells2 = JSON.parse(JSON.stringify(this.shipsInBoard));
        cells2[currentIndex].top = top;
        cells2[currentIndex].left = left;
        this.shipsInBoard = cells2;
        this.occupiedCells = this.releaseOccupiedCells(this.occupiedCells);
        this.occupiedCells = this.occupiedCells.concat(this.getAllCellPositions(top, left));
      }
    } else {
      // TO-DO: Check if the new ship is placed on top of occupied cells.
      let possibleCells = this.getAllCellPositions(top, left);
      console.log("on top", this.shipsInBoard.filter((x: any) => x.top === top && x.left === left));
      // console.log('intersect', filteredArray);

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
      } else {
        console.log("reset");
      }
    }
    console.log("Ships in board", this.shipsInBoard)
    console.log("Cells occupied", this.occupiedCells)
    this.activeDragShip = {};
    this.showGrid = false;
    setTimeout(() => {
      this.showGrid = true;
    }, 300);
  }

  checkIfCollide(arr: any[], arr2: any[]): boolean {
    return false;
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
    this.activeDragShip = {};
    this.occupiedCells = [];
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
