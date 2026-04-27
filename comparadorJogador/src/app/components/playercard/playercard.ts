import { Component, Input } from '@angular/core';
import { Badge } from "../badge/badge";
import { Stat } from "../stat/stat";

@Component({
  selector: 'app-playercard',
  imports: [Badge, Stat],
  templateUrl: './playercard.html',
  styleUrl: './playercard.scss',
})
export class Playercard {

  @Input() player: any;

}
