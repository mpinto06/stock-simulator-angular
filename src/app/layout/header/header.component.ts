import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppUtilService } from '../../core/services/app-util.service';
import { NotificationService } from '../../core/services/notification.service';
import { IconButtonComponent } from "../../core/components/icon-button/icon-button.component";
import { IconButtonInterface } from '../../core/components/icon-button/interface/icon-button.interface';

@Component({
  selector: 'stock-header',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent  implements OnInit{ 

  openMenu: boolean;
  mainLogo: string;
  userLogged: boolean;
  logoutIcon: IconButtonInterface;

  constructor(
    private menuService: MenuService,
    private destroyRef: DestroyRef,
    private appUtilsService: AppUtilService,
    private notificationService: NotificationService
  ) {
    this.openMenu = this.menuService.openMenu;
    this.mainLogo = this.appUtilsService.icons.logo;
    this.userLogged = this.notificationService.userLogged;
    this.logoutIcon = this.appUtilsService.iconButtons.logoutIcon;
    console.log(this.logoutIcon)
  }
  ngOnInit(): void {
    this.subscribeEvents();   
  }

  subscribeEvents(): void {
    this.menuService.openMenuObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(( open: boolean ) => {
      this.openMenu = open;
    })

    this.notificationService.userLoggedObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(( logged: boolean) => {
      this.userLogged = logged;
    })
  }

  toggle(): void {
    console.log('aaa?')
    this.menuService.toggle()
  }
}
