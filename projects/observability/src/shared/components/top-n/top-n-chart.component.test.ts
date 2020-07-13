import { FormattingModule } from '@hypertrace/common';
import { createHostFactory, Spectator } from '@ngneat/spectator/jest';
import { TopNChartComponent, TopNData } from './top-n-chart.component';

describe('Top N Chart Component', () => {
  let spectator: Spectator<TopNChartComponent>;

  const createHost = createHostFactory({
    component: TopNChartComponent,
    shallow: true,
    imports: [FormattingModule]
  });

  test('should convert data in descending order of their value', () => {
    const data: TopNData[] = [
      {
        label: 'POST /api 1',
        value: 80
      },
      {
        label: 'POST /api 3',
        value: 40
      },
      {
        label: 'POST /api 2',
        value: 120
      }
    ];

    spectator = createHost(
      `<ht-top-n-chart [data]="data">
      </ht-top-n-chart>`,
      {
        hostProps: {
          data: data
        }
      }
    );

    expect(spectator.component.itemOptions).toEqual([
      {
        label: 'POST /api 2',
        value: 120,
        width: '100.00%'
      },
      {
        label: 'POST /api 1',
        value: 80,
        width: '66.67%'
      },
      {
        label: 'POST /api 3',
        value: 40,
        width: '33.33%'
      }
    ]);
  });

  test('should have clickable labels', () => {
    const data = [
      {
        label: 'POST /api 1',
        value: 120
      }
    ];

    const onLabelClick: jest.Mock = jest.fn();

    spectator = createHost(
      `<ht-top-n-chart [data]="data" [labelClickable]="labelClickable" (labelClick)="onLabelClick($event)">
      </ht-top-n-chart>`,
      {
        hostProps: {
          data: data,
          labelClickable: true,
          onLabelClick: onLabelClick
        }
      }
    );

    spectator.click(spectator.query('.label')!);
    expect(onLabelClick).toHaveBeenCalledWith('POST /api 1');
  });

  test('should show progress bar and value', () => {
    const data = [
      {
        label: 'POST /api 1',
        value: 120
      }
    ];

    spectator = createHost(
      `<ht-top-n-chart [data]="data">
      </ht-top-n-chart>`,
      {
        hostProps: {
          data: data
        }
      }
    );

    expect(spectator.query('.progress-value')).toExist();
    expect(spectator.query('.value')).toHaveText('120 (100.00%)');
  });
});
