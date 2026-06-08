import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Stat } from "../stat/stat";

@Component({
  selector: 'app-playercard',
  imports: [Stat],
  templateUrl: './playercard.html',
  styleUrl: './playercard.scss',
})
export class Playercard {

  @Input() player: any;
  @Output() onSwap = new EventEmitter<void>();

}
