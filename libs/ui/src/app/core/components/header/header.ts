import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { GithubStars } from '../github-starts/github-stars';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [GithubStars, Button, RouterLink, RouterLinkActive],
})
export class Header {}
