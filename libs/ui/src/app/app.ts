import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/components/header/header';
import { NavMenu } from './core/components/nav-menu/nav-menu';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { APP_VERSION } from './core/constants/app-version';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, Header, NavMenu, LoadingBarRouterModule],
})
export class App {
  readonly version = `v${APP_VERSION}`;
  readonly mobileMenuVisible = signal(false);
  readonly mobileMenuOpen = signal(false);
  private closeMenuTimer: ReturnType<typeof setTimeout> | null = null;

  toggleMobileMenu() {
    if (this.mobileMenuOpen()) {
      this.closeMobileMenu();
      return;
    }

    this.openMobileMenu();
  }

  private openMobileMenu() {
    if (this.closeMenuTimer) {
      clearTimeout(this.closeMenuTimer);
      this.closeMenuTimer = null;
    }

    this.mobileMenuVisible.set(true);

    // Ensure the drawer is mounted before starting the enter transition.
    setTimeout(() => this.mobileMenuOpen.set(true), 10);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);

    if (this.closeMenuTimer) {
      clearTimeout(this.closeMenuTimer);
    }

    this.closeMenuTimer = setTimeout(() => {
      this.mobileMenuVisible.set(false);
      this.closeMenuTimer = null;
    }, 220);
  }
}
