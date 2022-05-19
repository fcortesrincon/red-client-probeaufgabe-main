import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { DetailViewComponent } from '../detail-view/detail-view.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      { path: 'imprint', loadChildren: () => import('../imprint/imprint.module').then((m) => m.ImprintModule) },
      { path: 'detail/:type/:id', component: DetailViewComponent },
      { path: '**', redirectTo: '/dashboard' },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
