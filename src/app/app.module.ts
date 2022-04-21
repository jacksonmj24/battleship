import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FillPipe} from "./fill.pipe";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ShipComponent } from './ship/ship.component';
import { GameBoardComponent } from './game-board/game-board.component';

@NgModule({
  declarations: [
    AppComponent,
    FillPipe,
    ShipComponent,
    GameBoardComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
