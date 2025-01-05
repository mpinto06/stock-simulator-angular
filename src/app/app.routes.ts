import { Routes } from '@angular/router';
import { StandardLayoutComponent } from './layout/standard-layout/standard-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: StandardLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./domain/home/page/home.page')
                  .then(m => m.HomePage)
            },
            {
                path: 'login',
                loadComponent: () => import('./domain/login/page/login.page')
                  .then(m => m.LoginPage)
            },
            {
                path: 'register',
                loadComponent: () => import('./domain/register/page/register.page')
                  .then(m => m.RegisterPage)
            },
            {
                path: 'summary',
                loadComponent: () => import('./domain/summary/page/summary.page')
                  .then(m => m.SummaryPage)
            },
            {
                path: 'buy',
                loadComponent: () => import('./domain/buy/page/buy.page')
                  .then(m => m.BuyPage)
            },
            {
                path: 'sell',
                loadComponent: () => import('./domain/sell/page/sell.page')
                  .then(m => m.SellPage)
            },
            {
                path: 'edit',
                loadComponent: () => import('./domain/edit/page/edit.page')
                    .then(m => m.EditPage)
            },
            {
                path: 'confirm',
                loadComponent: () => import('./domain/confirm/page/confirm.page')
                    .then(m => m.ConfirmPage)
            }
            
        ]
    }
];
