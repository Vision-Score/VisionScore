import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JogadoresService {

  constructor(private http: HttpClient) {}

  listarElenco(idTime: number): Observable<any[]> {
    return this.http.get<any[]>(`/jogadores/listarElenco/${idTime}`);
  }

  getMelhoresCampeoes(idJogador: number): Observable<any[]> {
    return this.http.get<any[]>(`/jogadores/getMelhoresCampeoes/${idJogador}`);
  }

  getJogadoresPorRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`/jogadores/getJogadoresPorRole/${role}`);
  }

  getJogadorPorIDeEquipe(idJogador: number, idEquipe: number): Observable<any> {
    return this.http.get<any>(`/jogadores/getJogadorPorIDeEquipe/${idJogador}/${idEquipe}`);
  }

  getTimePorId(idTime: number): Observable<any> {
    return this.http.get<any>(`/times/buscar/${idTime}`);
  }
}
