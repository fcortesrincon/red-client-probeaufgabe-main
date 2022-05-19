import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SearchFacadeService, SearchModule } from '@red-probeaufgabe/search';
import { UiModule } from '@red-probeaufgabe/ui';
import { DetailViewComponent } from '../detail-view/detail-view.component';

@NgModule({
  declarations: [DashboardComponent, DetailViewComponent],
  imports: [CommonModule, UiModule, SearchModule, DashboardRoutingModule],
  exports: [DashboardComponent],
  // Provide the AbstractSearchFacadeService required in the module
  providers: [{
    provide: 'AbstractSearchFacadeService',
    useClass: SearchFacadeService
  }]
})
export class DashboardModule {}
