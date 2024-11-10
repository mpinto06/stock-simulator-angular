import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { LoadingComponent } from "../../core/components/loading/loading.component";
import { LoadingService } from '../../core/services/loading.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { MenuComponent } from '../menu/menu.component';
import { MenuService } from '../../core/services/menu.service';
import { FooterComponent } from '../footer/footer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'stock-standard-layout',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    RouterOutlet,
    HeaderComponent,
    MenuComponent,
    FooterComponent
],
  templateUrl: './standard-layout.component.html',
  styleUrl: './standard-layout.component.scss',
})
export class StandardLayoutComponent implements OnInit{ 
  openMenu: boolean = true;

  constructor(
    private loadingService: LoadingService,
    private menuService: MenuService,
    private destroyRef: DestroyRef
  ) { 
  }
  ngOnInit(): void {
    this.openMenu = this.menuService.openMenu;
    this.subscribeEvents();
  }

  subscribeEvents(): void {
    this.menuService.openMenuObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(( value: boolean) => {
      this.openMenu = value;
    })
  }
} 
