import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeatureState, NavigationParams, NavigationParamsType } from '@hypertrace/common';
import { IconSize } from '../../icon/icon-size';
import { NavItemLinkConfig } from '../navigation.config';

@Component({
  selector: 'ht-nav-item',
  styleUrls: ['./nav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ht-link *ngIf="this.config" [paramsOrUrl]="buildNavigationParam | htMemoize: this.config">
      <div
        *htIfFeature="this.config.featureState$ | async as featureState"
        class="nav-item"
        [ngClass]="{ active: this.active }"
      >
        <ht-icon
          class="icon"
          [icon]="this.config.icon"
          size="{{ this.config.iconSize !== undefined ? this.config.iconSize : '${IconSize.Medium}' }}"
          [label]="this.config.label"
          [showTooltip]="this.collapsed"
        >
        </ht-icon>

        <div class="label-container" *ngIf="!this.collapsed">
          <span class="label">{{ this.config.label }}</span>
          <span *ngIf="featureState === '${FeatureState.Preview}'" class="soon-container">
            <span class="soon">SOON</span>
          </span>
          <ht-beta-tag *ngIf="config.isBeta" class="beta"></ht-beta-tag>
          <ht-icon
            class="trailing-icon"
            *ngIf="this.config.trailingIcon"
            [icon]="this.config.trailingIcon"
            size="{{ this.config.iconSize !== undefined ? this.config.iconSize : '${IconSize.Medium}' }}"
            [ngStyle]="{ color: this.config.trailingIconColor }"
            [htTooltip]="this.config.trailingIconTooltip"
          >
          </ht-icon>
        </div>
      </div>
    </ht-link>
  `
})
export class NavItemComponent {
  @Input()
  public config!: NavItemLinkConfig;

  @Input()
  public active: boolean = true;

  @Input()
  public collapsed: boolean = true;

  public buildNavigationParam = (item: NavItemLinkConfig): NavigationParams => ({
    navType: NavigationParamsType.InApp,
    path: item.matchPaths[0],
    relativeTo: this.activatedRoute,
    replaceCurrentHistory: item.replaceCurrentHistory
  });

  public constructor(private readonly activatedRoute: ActivatedRoute) {}
}
