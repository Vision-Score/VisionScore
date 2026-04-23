import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  imports: [],
  templateUrl: './stat.html',
  styleUrl: './stat.scss',
})
export class Stat {

  @Input() statName: string = '';
  @Input() statValue: string = '';
  @Input() statIcon: string = '';


}
