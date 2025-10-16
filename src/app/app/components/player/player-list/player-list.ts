
import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Player } from '../../../models/player.model';
import { PlayerService } from '../../../services/player.service';
import { SignalRService } from '../../../services/signalr.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './player-list.html',
  styleUrls: ['./player-list.css']
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  newPlayer: Player = { name: '', age: 0, role: '', team: '' };
  editMode = false;
  selectedPlayerId: number | null = null;
  loading = false;
  message = '';

  constructor(
    private playerService: PlayerService,
    private signalR: SignalRService,
    private ngZone: NgZone, // 👈 Inject NgZone
    private cd: ChangeDetectorRef 
  ) {}


async ngOnInit(): Promise<void> {
  this.loadPlayers();

  await this.signalR.startConnection();

  this.signalR.listenForCrudEvents<Player>('Player', {
    created: (p) => {
      this.ngZone.run(() => {
        this.players.push(p);
        this.cd.detectChanges(); // ensure UI updates immediately
      });
    },
    updated: (p) => {
      this.ngZone.run(() => {
        this.players = this.players.map(x => x.playerId === p.playerId ? p : x);
        this.cd.detectChanges();
      });
    },
   
      deleted: (id) => {
      this.players = this.players.filter(x => x.playerId !== id);
     this.cd.detectChanges();
   }
    
  });
  //this.loadPlayers();
}


  loadPlayers(): void {
    this.loading = true;
    this.playerService.getAll().subscribe({
      next: (res) => {
        this.players = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load players', err);
        this.loading = false;
      }
    });
  }

  addPlayer(): void {
    if (!this.newPlayer.name || !this.newPlayer.team) {
      this.message = 'Please fill all fields.';
      return;
    }

    this.playerService.create(this.newPlayer).subscribe({
      next: () => {
        this.message = '✅ Player added successfully!';
        this.newPlayer = { name: '', age: 0, role: '', team: '' };
        // no loadPlayers(), SignalR will handle UI
        this.loadPlayers();
      },
      error: () => (this.message = '❌ Failed to add player.')
    });
  }

  editPlayer(player: Player): void {
    this.editMode = true;
    this.selectedPlayerId = player.playerId!;
    this.newPlayer = { ...player };
  }

  updatePlayer(): void {
    if (this.selectedPlayerId == null) return;

    this.playerService.update(this.selectedPlayerId, this.newPlayer).subscribe({
      next: () => {
        this.message = '✅ Player updated successfully!';
        this.cancelEdit();
        // no loadPlayers(), SignalR will update UI
       this.loadPlayers();
      },
      error: () => (this.message = '❌ Failed to update player.')
    });
  }

  deletePlayer(id: number): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.playerService.delete(id).subscribe({
        next: () => {
          this.message = '🗑️ Player deleted.';
         
        this.loadPlayers();
        },
        error: () => (this.message = '❌ Failed to delete player.')
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.selectedPlayerId = null;
    this.newPlayer = { name: '', age: 0, role: '', team: '' };
  }
}
