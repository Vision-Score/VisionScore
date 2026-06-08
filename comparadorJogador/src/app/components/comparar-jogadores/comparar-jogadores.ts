import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Playercard } from "../playercard/playercard";
import { BuscarJogador } from "../buscar-jogador/buscar-jogador";
import { JogadoresService } from "../services/jogadores.service";
import { SplashService } from "../services/splash.service";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-comparar-jogadores',
  imports: [Playercard, BuscarJogador],
  templateUrl: './comparar-jogadores.html',
  styleUrl: './comparar-jogadores.scss',
})
export class CompararJogadores implements OnInit {

  idEquipe!: number;
  idAliado!: number;
  idAdversario!: number;

  elencoAliado: any[] = [];
  jogadoresParaComparar: any[] = [];
  jogadorAdversario: any;
  jogadorAdversarioStats: any[] = [];
  playerAliado: any = null;
  playerAdversario: any = null;
  buscarAtivoAliado = false;
  buscarAtivoAdversario = false;
  loadingAdversario = false;
  private adversarioRequestId = 0;
  splashAliado = '';
  splashAdversario = '';

  constructor(
    private jogadoresService: JogadoresService,
    private splashService: SplashService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    this.idEquipe = Number(params.get('idEquipe'));
    this.idAliado = Number(params.get('idAliado'));
    this.idAdversario = Number(params.get('idAdversario'));

    if (this.idAdversario) {
      this.loadingAdversario = true;
      this.cdr.detectChanges();
    }

    try {
      const cachedElenco = sessionStorage.getItem('elenco');
      this.elencoAliado = cachedElenco
        ? JSON.parse(cachedElenco)
        : await firstValueFrom(this.jogadoresService.listarElenco(this.idEquipe));

      const jogadorAtual = this.elencoAliado.find(j => j.idJogador === this.idAliado);
      if (!jogadorAtual) { console.error('Aliado não encontrado no elenco'); return; }

      const role = jogadorAtual.funcao.toLowerCase();
      const cachedJogadoresPorRole = sessionStorage.getItem(`jogadores_${role}`);
      if (cachedJogadoresPorRole) {
        this.jogadoresParaComparar = JSON.parse(cachedJogadoresPorRole);
      } else {
        this.jogadoresParaComparar = await firstValueFrom(this.jogadoresService.getJogadoresPorRole(role));
        sessionStorage.setItem(`jogadores_${role}`, JSON.stringify(this.jogadoresParaComparar));
      }

      const campeaoesAliado: any[] = await firstValueFrom(this.jogadoresService.getMelhoresCampeoes(this.idAliado));
      const splashesAliado = await Promise.all(campeaoesAliado.map((c: any) => this.splashService.getUrl(c.nomeCampeao)));
      this.splashAliado = splashesAliado[0] ?? '';
      const campeoesAliado = campeaoesAliado.map((c: any, i: number) => ({ ...c, splashUrl: splashesAliado[i] }));
      this.playerAliado = this.montarPlayer(jogadorAtual, undefined, campeoesAliado);

      if (!this.idAdversario) return;

      this.jogadorAdversario = this.jogadoresParaComparar.find(j => j.idJogador === this.idAdversario);
      if (!this.jogadorAdversario) { console.error('Adversário não encontrado na lista de jogadores'); return; }

      const cachedElencoAdversario = sessionStorage.getItem(`elencoAdversario_${this.jogadorAdversario.fkEquipe}`);
      if (cachedElencoAdversario) {
        const elencoAdv = JSON.parse(cachedElencoAdversario);
        this.jogadorAdversarioStats = [elencoAdv.find((j: any) => j.idJogador === this.idAdversario)];
      } else {
        this.jogadorAdversarioStats = await firstValueFrom(this.jogadoresService.getJogadorPorIDeEquipe(this.idAdversario, this.jogadorAdversario.fkEquipe));
      }

      const campeaoesAdversario: any[] = await firstValueFrom(this.jogadoresService.getMelhoresCampeoes(this.idAdversario));
      const splashesAdversario = await Promise.all(campeaoesAdversario.map((c: any) => this.splashService.getUrl(c.nomeCampeao)));
      this.splashAdversario = splashesAdversario[0] ?? '';
      const campeoesAdversario = campeaoesAdversario.map((c: any, i: number) => ({ ...c, splashUrl: splashesAdversario[i] }));

      this.playerAdversario = this.montarPlayer(this.jogadorAdversario, this.jogadorAdversarioStats[0], campeoesAdversario);
      this.aplicarComparacao();
    } catch (e) {
      console.error('Erro ao carregar comparação:', e);
    } finally {
      this.loadingAdversario = false;
      this.cdr.detectChanges();
    }
  }

  async trocarAliado(jogador: any) {
    this.buscarAtivoAliado = false;
    this.playerAdversario = null;
    this.splashAdversario = '';
    this.cdr.detectChanges();

    const campeoes: any[] = await firstValueFrom(this.jogadoresService.getMelhoresCampeoes(jogador.idJogador));
    const splashUrls = await Promise.all(campeoes.map((c: any) => this.splashService.getUrl(c.nomeCampeao)));
    this.splashAliado = splashUrls[0] ?? '';
    const campeoesComSplash = campeoes.map((c: any, i: number) => ({ ...c, splashUrl: splashUrls[i] }));

    this.playerAliado = this.montarPlayer(jogador, undefined, campeoesComSplash);
    this.cdr.detectChanges();

    const role = jogador.funcao.toLowerCase();
    const cached = sessionStorage.getItem(`jogadores_${role}`);
    if (cached) {
      this.jogadoresParaComparar = JSON.parse(cached);
    } else {
      this.jogadoresParaComparar = [];
      this.cdr.detectChanges();
      this.jogadoresParaComparar = await firstValueFrom(this.jogadoresService.getJogadoresPorRole(role));
      sessionStorage.setItem(`jogadores_${role}`, JSON.stringify(this.jogadoresParaComparar));
      this.cdr.detectChanges();
    }
  }

  async trocarAdversario(jogador: any) {
    const requestId = ++this.adversarioRequestId;

    this.playerAdversario = null;
    this.buscarAtivoAdversario = false;
    this.loadingAdversario = true;
    this.cdr.detectChanges();

    try {
      const stats = await firstValueFrom(this.jogadoresService.getJogadorPorIDeEquipe(jogador.idJogador, jogador.fkEquipe));
      if (requestId !== this.adversarioRequestId) return;

      const campeoes: any[] = await firstValueFrom(this.jogadoresService.getMelhoresCampeoes(jogador.idJogador));
      if (requestId !== this.adversarioRequestId) return;

      const splashUrls = await Promise.all(campeoes.map((c: any) => this.splashService.getUrl(c.nomeCampeao)));
      if (requestId !== this.adversarioRequestId) return;

      this.splashAdversario = splashUrls[0] ?? '';
      const campeoesComSplash = campeoes.map((c: any, i: number) => ({ ...c, splashUrl: splashUrls[i] }));
      this.playerAdversario = this.montarPlayer(jogador, Array.isArray(stats) ? stats[0] : stats, campeoesComSplash);
      this.aplicarComparacao();
    } finally {
      if (requestId === this.adversarioRequestId) {
        this.loadingAdversario = false;
        this.cdr.detectChanges();
      }
    }
  }

  goBack() {
    history.back();
  }

  aplicarComparacao() {
    if (!this.playerAliado || !this.playerAdversario) return;
    const MENOR_MELHOR = new Set([2]); // índice de Mortes
    this.playerAliado.stats.forEach((stat: any, i: number) => {
      const valA = parseFloat(stat.value);
      const valB = parseFloat(this.playerAdversario.stats[i].value);
      const aliadoVence = MENOR_MELHOR.has(i) ? valA < valB : valA > valB;
      const adversarioVence = MENOR_MELHOR.has(i) ? valB < valA : valB > valA;
      if (aliadoVence) {
        this.playerAliado.stats[i].icon = 'arrow_upward';
        this.playerAdversario.stats[i].icon = 'arrow_downward';
      } else if (adversarioVence) {
        this.playerAliado.stats[i].icon = 'arrow_downward';
        this.playerAdversario.stats[i].icon = 'arrow_upward';
      } else {
        this.playerAliado.stats[i].icon = 'remove';
        this.playerAdversario.stats[i].icon = 'remove';
      }
    });
  }

  montarPlayer(jogador: any, statsJogador?: any, campeoes: any[] = []) {
    const stats = statsJogador || jogador;
    return {
      name: jogador.nome,
      position: jogador.funcao,
      icon: jogador.urlFotoJogador || 'assets/imagem_quebrada.svg',
      campeoes,
      stats: [
        { name: 'Dano por Minuto (DpM)', value: (stats.mediaDano / 30).toFixed(1), icon: 'remove' },
        { name: 'Abates (Kills)', value: String(stats.mediaElims), icon: 'remove' },
        { name: 'Mortes (Deaths)', value: String(stats.mediaMortes), icon: 'remove' },
        { name: 'Assistências (Assists)', value: String(stats.mediaAssists), icon: 'remove' },
        { name: 'Participação em Abates (KP%)', value: `${stats.mediaKP}%`, icon: 'remove' },
        { name: 'Ouro por Minuto (GPM)', value: (stats.mediaOuro / 30).toFixed(1), icon: 'remove' },
        { name: 'CS por Minuto (CSPM)', value: (stats.mediaCS / 30).toFixed(1), icon: 'remove' },
        { name: 'Wards por Minuto', value: (stats.mediaWards / 30).toFixed(2), icon: 'remove' },
      ]
    };
  }
}

