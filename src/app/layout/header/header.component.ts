import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppUtilService } from '../../core/services/app-util.service';

@Component({
  selector: 'stock-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent  implements OnInit{ 

  openMenu: boolean;
  mainLogo: string;

  constructor(
    private menuService: MenuService,
    private destroyRef: DestroyRef,
    private appUtilsService: AppUtilService
  ) {
    this.openMenu = this.menuService.openMenu;
    this.mainLogo = appUtilsService.icons.logo;
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
  }

  toggle(): void {
    console.log('aaa?')
    this.menuService.toggle()
  }
}
