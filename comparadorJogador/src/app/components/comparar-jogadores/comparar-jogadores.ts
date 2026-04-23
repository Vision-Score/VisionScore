import { Component } from '@angular/core';
import { Playercard } from "../playercard/playercard";

@Component({
  selector: 'app-comparar-jogadores',
  imports: [Playercard],
  templateUrl: './comparar-jogadores.html',
  styleUrl: './comparar-jogadores.scss',
})
export class CompararJogadores {

  player = {
    name: 'Faker',
    position: 'Mid Laner',
    teamLogo: 'assets/icons/t1logo.png',
    icon: 'assets/playerIcons/Faker.jpg',
    badges: [
      { name: 'Early Agressivo', icon: 'aim.svg' },
      { name: 'Defesa Sólida', icon: 'Toughness_rating.png' },
      { name: 'Cura Constante', icon: 'hourglass.svg' },
      { name: 'Movimentação Ágil', icon: 'stopwatch.svg' },
      { name: 'Controle de Área', icon: 'stopwatch.svg' },
    ],
    stats: [
      { name: 'Abates por jogo', value: '7.4', icon: 'arrow_upward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Abates por jogo', value: '7.4', icon: 'arrow_upward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Abates por jogo', value: '7.4', icon: 'arrow_upward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Abates por jogo', value: '7.4', icon: 'arrow_upward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Abates por jogo', value: '7.4', icon: 'arrow_upward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
      { name: 'Torres abatidas por jogo', value: '0.60', icon: 'arrow_downward' },
    ],
  };
}
