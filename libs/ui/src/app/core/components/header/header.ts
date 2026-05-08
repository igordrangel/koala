import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { GithubStars } from '../github-starts/github-stars';
import { Tooltip } from '../../../shared/components/tooltip/tooltip';
import { NavMenu } from '../nav-menu/nav-menu';
import { APP_VERSION } from '../../constants/app-version';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [CommonModule, GithubStars, Button, RouterLink, RouterLinkActive, Tooltip, NavMenu],
})
export class Header {
  readonly copied = signal(false);
  readonly version = `v${APP_VERSION}`;
  readonly mobileMenuVisible = signal(false);
  readonly mobileMenuOpen = signal(false);

  constructor(private router: Router) {}

  copyLlmsUrl() {
    const url = `${window.location.origin}/llms.txt`;
    navigator.clipboard.writeText(url).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  toggleMobileMenu() {
    const isVisible = this.mobileMenuVisible();
    this.mobileMenuVisible.set(!isVisible);
    if (!isVisible) {
      setTimeout(() => this.mobileMenuOpen.set(true), 10);
    }
  }

  openMobileMenu() {
    this.mobileMenuVisible.set(true);
    setTimeout(() => this.mobileMenuOpen.set(true), 10);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    setTimeout(() => this.mobileMenuVisible.set(false), 200);
  }
}
