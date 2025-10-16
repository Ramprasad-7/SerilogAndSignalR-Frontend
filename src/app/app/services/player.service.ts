
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Player } from '../models/player.model';
import { ApiResponse } from '../models/api-response.model'; // wrapper interface

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = 'http://localhost:5272/api/Player';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Player[]> {
    return this.http.get<ApiResponse<Player[]>>(this.apiUrl)
      .pipe(map(response => response.data)); // unwrap Data
  }

  create(player: Player): Observable<Player> {
    return this.http.post<ApiResponse<Player>>(this.apiUrl, player)
      .pipe(map(res => res.data));
  }

  update(id: number, player: Player): Observable<Player> {
    return this.http.put<ApiResponse<Player>>(`${this.apiUrl}/${id}`, player)
      .pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
