import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { LoadingComponent } from "../../core/components/loading/loading.component";
import { LoadingService } from '../../core/services/loading.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { MenuComponent } from '../menu/menu.component';
import { MenuService } from '../../core/services/menu.service';
import { FooterComponent } from '../footer/footer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'stock-standard-layout',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    RouterOutlet,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    SidebarComponent
],
  templateUrl: './standard-layout.component.html',
  styleUrl: './standard-layout.component.scss',
})
export class StandardLayoutComponent implements OnInit{ 
  openMenu: boolean = true;
  loggedPaths = ['/summary', '/buy', '/sell', '/transfer' , '/confirm', '/edit', '/support'];

  constructor(
    private loadingService: LoadingService,
    private menuService: MenuService,
    private destroyRef: DestroyRef,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
  ) { 
  }
  ngOnInit(): void {
    this.openMenu = this.menuService.isMenuOpen;
    console.log('siempre');
    this.subscribeEvents();
    if (this.userService.currentUser != null && this.loggedPaths.includes(this.router.url)) {
      this.notificationService.login();
    }
    else {
      this.userService.removeUserStorage();
      this.notificationService.logout();
      if (this.loggedPaths.includes(this.router.url)) {
        console.log('aqui?')
        this.router.navigate(['/home']).catch();
      }
    }
  }

  subscribeEvents(): void {
    this.menuService.openMenuObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(( value: boolean) => {
      this.openMenu = value;
    })

    this.router.events
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0);
        }
      });
  }
} 
