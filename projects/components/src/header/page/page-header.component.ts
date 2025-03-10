import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  Breadcrumb,
  isNonEmptyString,
  NavigationService,
  PreferenceService,
  SubscriptionLifecycle
} from '@hypertrace/common';
import { Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { BreadcrumbsService } from '../../breadcrumbs/breadcrumbs.service';
import { IconSize } from '../../icon/icon-size';
import { NavigableTab } from '../../tabs/navigable/navigable-tab';

@Component({
  selector: 'ht-page-header',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SubscriptionLifecycle],
  template: `
    <div
      *ngIf="this.breadcrumbs$ | async as breadcrumbs"
      class="page-header"
      [class.bottom-border]="!this.tabs?.length"
    >
      <div class="breadcrumb-container">
        <ht-breadcrumbs [breadcrumbs]="breadcrumbs"></ht-breadcrumbs>
        <div class="title" *ngIf="this.titlecrumb$ | async as titlecrumb">
          <ht-icon
            class="icon"
            *ngIf="titlecrumb.icon && breadcrumbs.length <= 1"
            [icon]="titlecrumb.icon"
            [label]="titlecrumb.label"
            size="${IconSize.Large}"
          ></ht-icon>

          <ht-label [label]="titlecrumb.label"></ht-label>
          <ht-beta-tag *ngIf="this.isBeta" class="beta"></ht-beta-tag>
        </div>
      </div>

      <ng-content></ng-content>

      <ht-navigable-tab-group *ngIf="this.tabs?.length" class="tabs" (tabChange)="this.onTabChange($event)">
        <ht-navigable-tab
          *ngFor="let tab of this.tabs"
          [path]="tab.path"
          [hidden]="tab.hidden"
          [features]="tab.features"
        >
          {{ tab.label }}
        </ht-navigable-tab>
      </ht-navigable-tab-group>
    </div>
  `
})
export class PageHeaderComponent implements OnInit {
  @Input()
  public persistenceId?: string;

  @Input()
  public tabs?: NavigableTab[] = [];

  @Input()
  public isBeta: boolean = false;

  public breadcrumbs$: Observable<Breadcrumb[] | undefined> = this.breadcrumbsService.breadcrumbs$.pipe(
    map(breadcrumbs => (breadcrumbs.length > 0 ? breadcrumbs : undefined))
  );

  public titlecrumb$: Observable<Breadcrumb | undefined> = this.breadcrumbsService.breadcrumbs$.pipe(
    map(breadcrumbs => (breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : {}))
  );

  public constructor(
    protected readonly navigationService: NavigationService,
    protected readonly preferenceService: PreferenceService,
    protected readonly subscriptionLifecycle: SubscriptionLifecycle,
    protected readonly breadcrumbsService: BreadcrumbsService
  ) {}

  public ngOnInit(): void {
    this.subscriptionLifecycle.add(
      this.getPreferences().subscribe(preferences => this.navigateIfPersistedActiveTab(preferences))
    );
  }

  private navigateIfPersistedActiveTab(preferences: PageHeaderPreferences): void {
    if (isNonEmptyString(this.persistenceId) && isNonEmptyString(preferences.selectedTabPath)) {
      this.navigationService.navigateWithinApp(
        preferences.selectedTabPath,
        this.navigationService.getCurrentActivatedRoute().parent!
      );
    }
  }

  public onTabChange(path?: string): void {
    this.setPreferences(path);
  }

  private getPreferences(): Observable<PageHeaderPreferences> {
    return isNonEmptyString(this.persistenceId)
      ? this.preferenceService.get<PageHeaderPreferences>(this.persistenceId, {}).pipe(first())
      : of({});
  }

  private setPreferences(selectedTabPath?: string): void {
    if (isNonEmptyString(this.persistenceId)) {
      this.preferenceService.set(this.persistenceId, {
        selectedTabPath: selectedTabPath
      });
    }
  }
}

interface PageHeaderPreferences {
  selectedTabPath?: string;
}
