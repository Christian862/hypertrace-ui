import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GraphQlModule } from '@hypertrace/graphql-client';
import { DashboardCoreModule } from '@hypertrace/hyperdash-angular';
import { ExploreGraphQlQueryHandlerService } from '../../../../graphql/request/handlers/explore/explore-graphql-query-handler.service';
import { TraceCallsPercentageDataSourceModel } from './trace-calls-percentage-data-source.model';

@NgModule({
  declarations: [],
  imports: [
    DashboardCoreModule.with({
      models: [TraceCallsPercentageDataSourceModel]
    }),
    GraphQlModule.withHandlerProviders([ExploreGraphQlQueryHandlerService]),
    CommonModule
  ]
})
export class TraceCallsPercentageDataSourceModule {}
