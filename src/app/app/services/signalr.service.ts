
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  startConnection(): Promise<void> {
    if (this.hubConnection) return Promise.resolve();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5272/hubs/app') // match backend
      .withAutomaticReconnect()
      .build();

    return this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR Connected'))
      .catch(err => console.error('❌ SignalR Error:', err));
  }

  listenForCrudEvents<T>(
    entityName: string,
    callbacks: {
      created?: (item: T) => void;
      updated?: (item: T) => void;
      deleted?: (id: number | string) => void;
    }
  ) {
    if (!this.hubConnection) return;

    if (callbacks.created) this.hubConnection.on(`${entityName}Created`, callbacks.created);
    if (callbacks.updated) this.hubConnection.on(`${entityName}Updated`, callbacks.updated);
    if (callbacks.deleted) this.hubConnection.on(`${entityName}Deleted`, callbacks.deleted);
  }
}
