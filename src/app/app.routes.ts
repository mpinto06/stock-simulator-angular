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
        ]
    }
];
