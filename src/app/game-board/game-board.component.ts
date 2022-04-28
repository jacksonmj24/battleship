import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  @Input() set config(config: any) {
    this.boardConfig = config
  }

  @Output() evt = new EventEmitter<any>()
  @ViewChild('playerBoard', {read: ElementRef, static: false}) boardElement: any;

  boardConfig: any = {};
  position: any

  constructor() {
  }

  ngOnInit(): void {
  }

  handleClick() {
    let top = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0;
    let left = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0;
    let flag: string = '';
    let match = this.boardConfig.shipsInBoard.filter((x: any) => (Math.round(x.top) === Math.round(top) && Math.round(x.left) === Math.round(left)));
    if (match.length) {
      flag = 'hit';
    }
    this.mark(top, left, flag);
    this.evt.emit({status: 'completed', payload: this.boardConfig})
  }

  mark(top: number, left: number, status?: string) {
    this.boardConfig['selections'].push({name: '', size: 1, top, left, type: status || 'miss'})
  }
}
