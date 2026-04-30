import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GithubStars } from './core/components/github-starts/github-stars';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, GithubStars],
})
export class App {}
