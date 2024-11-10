import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { MenuItemInterface } from './interface/menu-item.interface';
import JSON_MENU from './json/menu.json';
import { NotificationService } from '../../core/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppUtilService } from '../../core/services/app-util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'stock-menu',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  
  itemsMenu: MenuItemInterface[] = [];
  openMenu: boolean;
  icons: any;
  
  constructor(
    private menuService: MenuService,
    private notificationService: NotificationService,
    private destroyRef: DestroyRef,
    private router: Router,
    private appUtilService: AppUtilService
  ) {
    this.openMenu = menuService.openMenu;
    this.icons = this.appUtilService.icons;
  }
  
  ngOnInit(): void {
    if (this.notificationService.userLogged) {
      this.itemsMenu = structuredClone(JSON_MENU.itemsLogged)
    }
    else {
      this.itemsMenu = structuredClone(JSON_MENU.itemsNotLogged)
    }

    this.subscribeEvents();
  }

  subscribeEvents(): void {
    this.notificationService.userLoggedObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(( logged: boolean) => {
      if (logged) {
        this.itemsMenu = structuredClone(JSON_MENU.itemsLogged)
      }
      else {
        this.itemsMenu = structuredClone(JSON_MENU.itemsNotLogged)
      }
    })

    this.menuService.openMenuObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(( open: boolean ) => {
      this.openMenu = open;
    })
  }

  currentUrl(url: string): boolean {
    return url == this.router.url;
  }
    

}
