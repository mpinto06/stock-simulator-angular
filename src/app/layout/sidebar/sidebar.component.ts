import { Component, DestroyRef, type OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user.service';
import { IconButtonComponent } from '../../core/components/icon-button/icon-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'stock-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {

  openSidebar: boolean;

  constructor(
    private menuService: MenuService,
    private destroyRef: DestroyRef,
    private userService: UserService,
    private router: Router
  ) 
  {
    this.openSidebar = menuService.isSidebarOpen; 
  }

  ngOnInit(): void { 
    this.subscribeEvents();
  }

  subscribeEvents(): void {
    this.menuService.openSidebarObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(( open: boolean ) => {
      this.openSidebar = open;
    })
  }

  verifyUser(): void {
    this.menuService.closeSidebar();
    this.router.navigate(['/confirm']).catch();
  }

  editUser(): void {
    this.menuService.closeSidebar();
    this.router.navigate(['/edit']).catch();
  }

  get userInitials(): string {
    return this.userService.currentUser.firstName.charAt(0) + this.userService.currentUser.lastName.charAt(0);
  }

  get userFullName(): string {
    return this.userService.currentUser.firstName + ' ' + this.userService.currentUser.lastName;
  }

  get userEmail(): string {
    return this.userService.currentUser.email;
  }

  get userUsername(): string {
    return this.userService.currentUser.username;
  }

  get userVerified(): boolean {
    return this.userService.currentUser.verified;
  }

}
