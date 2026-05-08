import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { GithubStars } from '../github-starts/github-stars';
import { Tooltip } from '../../../shared/components/tooltip/tooltip';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [GithubStars, Button, RouterLink, RouterLinkActive, Tooltip],
})
export class Header {
  readonly copied = signal(false);

  copyLlmsUrl() {
    const url = `${window.location.origin}/llms.txt`;
    navigator.clipboard.writeText(url).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
