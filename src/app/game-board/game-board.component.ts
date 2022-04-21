import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  @Input() set config(config: any) {
    this.boardConfig = config
  }

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
    console.log('top', this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0);
    console.log('left', this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0);
    let clickX = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0;
    let clickY = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0;
    console.log();
    let match = this.boardConfig.shipsInBoard.filter((x: any) => x.top === clickX || x.left === clickY);
    if (match.length) {
      this.boardConfig['selections'].push({name: '', size: 1, top: clickX, left: clickY, type: 'hit'});
    } else {
      this.boardConfig['selections'].push({name: '', size: 1, top: clickX, left: clickY, type: 'miss'});
    }
  }
}
