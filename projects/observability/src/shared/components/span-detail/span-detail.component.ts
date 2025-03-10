import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TypedSimpleChanges } from '@hypertrace/common';
import { isEmpty } from 'lodash-es';
import { SpanData } from './span-data';
import { SpanDetailLayoutStyle } from './span-detail-layout-style';
import { SpanDetailTab } from './span-detail-tab';

@Component({
  selector: 'ht-span-detail',
  styleUrls: ['./span-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="span-detail" *ngIf="this.spanData">
      <ht-span-detail-title-header
        class="title-header"
        *ngIf="this.showTitleHeader"
        [serviceName]="this.spanData.serviceName"
        [protocolName]="this.spanData.protocolName"
        [apiName]="this.spanData.apiName"
        (closed)="this.closed.emit()"
      ></ht-span-detail-title-header>

      <div class="summary-container">
        <ng-content></ng-content>
      </div>

      <ht-tab-group
        class="tabs-group"
        [activeTabLabel]="this.activeTabLabel"
        (activeTabLabelChange)="this.onActiveTabLabelChange($event)"
      >
        <ht-tab label="${SpanDetailTab.Request}" *ngIf="this.showRequestTab">
          <ht-span-request-detail
            class="request"
            [layout]="this.layout"
            [requestHeaders]="this.spanData.requestHeaders"
            [requestCookies]="this.spanData.requestCookies"
            [requestBody]="this.spanData.requestBody"
          ></ht-span-request-detail>
        </ht-tab>
        <ht-tab label="${SpanDetailTab.Response}" *ngIf="this.showResponseTab">
          <ht-span-response-detail
            class="response"
            [layout]="this.layout"
            [responseHeaders]="this.spanData.responseHeaders"
            [responseCookies]="this.spanData.responseCookies"
            [responseBody]="this.spanData.responseBody"
          ></ht-span-response-detail>
        </ht-tab>
        <ht-tab label="${SpanDetailTab.Attributes}" class="attributes">
          <ht-span-tags-detail [tags]="this.spanData.tags"></ht-span-tags-detail>
        </ht-tab>
        <ht-tab label="${SpanDetailTab.ExitCalls}" *ngIf="this.showExitCallsTab">
          <ht-span-exit-calls [exitCalls]="this.spanData.exitCallsBreakup"></ht-span-exit-calls>
        </ht-tab>
        <ht-tab *ngIf="this.showLogEventsTab" label="Logs" [labelTag]="this.totalLogEvents">
          <ht-log-events-table [logEvents]="this.spanData?.logEvents"></ht-log-events-table>
        </ht-tab>
      </ht-tab-group>
    </div>
  `
})
export class SpanDetailComponent implements OnChanges {
  @Input()
  public spanData?: SpanData;

  @Input()
  public showTitleHeader: boolean = false;

  @Input()
  public layout: SpanDetailLayoutStyle = SpanDetailLayoutStyle.Horizontal;

  @Input()
  public activeTabLabel?: SpanDetailTab;

  @Output()
  private readonly activeTabLabelChange: EventEmitter<SpanDetailTab> = new EventEmitter<SpanDetailTab>();

  @Output()
  public readonly closed: EventEmitter<void> = new EventEmitter<void>();

  public showRequestTab?: boolean;
  public showResponseTab?: boolean;
  public showExitCallsTab?: boolean;
  public showLogEventsTab?: boolean;
  public totalLogEvents?: number;

  public ngOnChanges(changes: TypedSimpleChanges<this>): void {
    if (changes.spanData) {
      this.showRequestTab =
        !isEmpty(this.spanData?.requestHeaders) ||
        !isEmpty(this.spanData?.requestCookies) ||
        !isEmpty(this.spanData?.requestBody);
      this.showResponseTab =
        !isEmpty(this.spanData?.responseHeaders) ||
        !isEmpty(this.spanData?.responseCookies) ||
        !isEmpty(this.spanData?.responseBody);
      this.showExitCallsTab = !isEmpty(this.spanData?.exitCallsBreakup);
      this.showLogEventsTab = !isEmpty(this.spanData?.logEvents);
      this.totalLogEvents = (this.spanData?.logEvents ?? []).length;
    }
  }

  public onActiveTabLabelChange(tabLabel: SpanDetailTab): void {
    this.activeTabLabel = tabLabel;
    this.activeTabLabelChange.emit(tabLabel);
  }
}
