import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscar-jogador',
  imports: [FormsModule],
  templateUrl: './buscar-jogador.html',
  styleUrl: './buscar-jogador.scss',
})
export class BuscarJogador implements OnInit, OnChanges {

  @Input() jogadores: any[] = [];
  @Output() fechar = new EventEmitter<void>();
  @Output() jogadorSelecionado = new EventEmitter<any>();

  busca: string = '';
  loading = true;
  private timerStarted = false;

  get jogadoresFiltrados(): any[] {
    const q = this.busca.trim().toLowerCase();
    return q ? this.jogadores.filter(j => j.nome.toLowerCase().includes(q)) : this.jogadores;
  }

  private timesCache: Record<number, string> = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const cached = sessionStorage.getItem('times');
    if (cached) {
      JSON.parse(cached).forEach((t: any) => {
        this.timesCache[t.id_equipe] = t.urlImagem;
      });
    }
    if (this.jogadores.length > 0) {
      this.loading = false;
    }
    // se vazio, ngOnChanges aguarda os dados chegarem pela rede
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jogadores']?.currentValue?.length > 0 && !this.timerStarted) {
      this.timerStarted = true;
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  urlTime(fkEquipe: number): string {
    return this.timesCache[fkEquipe] || 'assets/imagem_quebrada.svg';
  }

  roleIcon(funcao: string): string {
    const mapa: Record<string, string> = {
      Mid: 'Middle_icon.png',
      Bot: 'Bottom_icon.png',
      Top: 'Top_icon.png',
      Jungle: 'Jungle_icon.png',
      Support: 'Support_icon_WR.png',
    };
    return `assets/icons/${mapa[funcao] ?? funcao + '_icon.png'}`;
  }
}
