import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { Header } from './core/components/header';
import { NavMenu } from './core/components/nav-menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, Header, NavMenu, LoadingBarRouterModule],
})
export class App {}
