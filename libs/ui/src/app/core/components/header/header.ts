import { Component } from '@angular/core';
import { GithubStars } from '../github-starts/github-stars';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [GithubStars],
})
export class Header {}
