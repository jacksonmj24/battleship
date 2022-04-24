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

  handleClick(event: MouseEvent, boundingClientRect: DOMRect) {
    console.log(event);
    console.log(boundingClientRect);
    console.log(this.boardConfig);
    let clickX = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0;
    let clickY = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0;
    let flag: string = '';
    let match = this.boardConfig.shipsInBoard.filter((x: any) => x.top === clickX && x.left === clickY);
    if (!match.length) {
      let secondaryMatch = this.boardConfig.shipsInBoard.filter((x: any) => x.top === clickX);
      if (secondaryMatch.length) {
        secondaryMatch.forEach((itm: any) => {
          console.log(itm, clickX, clickY);
          if (itm.size > 1 && clickY > itm.left && clickY <= (itm.left + (itm.size - 1) * 30)) {
            flag = 'hit';
          }
        });
      }
    } else {
      flag = 'hit';
    }
    this.mark(clickX, clickY, flag);
    console.log(match);
    this.evt.emit({status: 'completed', payload: this.boardConfig})
  }

  mark(top: number, left: number, status?: string) {
    this.boardConfig['selections'].push({name: '', size: 1, top, left, type: status || 'miss'})
  }
}
