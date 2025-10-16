import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { PlayerListComponent } from './app/app/components/player/player-list/player-list';
import { Platform } from '@microsoft/signalr/dist/esm/Utils';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
