import { IconType } from '@hypertrace/assets-library';
import { createHostFactory } from '@ngneat/spectator/jest';
import { MockComponent, MockModule } from 'ng-mocks';
import { IconComponent } from '../icon/icon.component';
import { LabelComponent } from '../label/label.component';
import { TooltipModule } from '../tooltip/tooltip.module';
import { FormFieldComponent } from './form-field.component';

describe('Form Field Component', () => {
  const hostFactory = createHostFactory({
    component: FormFieldComponent,
    declarations: [MockComponent(LabelComponent), MockComponent(IconComponent)],
    imports: [MockModule(TooltipModule)],
    shallow: true
  });

  test('should show mandatory form field data', () => {
    const spectator = hostFactory(
      `
    <ht-form-field [label]="label" [icon]="icon" [iconTooltip]="iconTooltip" [errorLabel]="errorLabel">
    </ht-form-field>`,
      {
        hostProps: {
          label: 'Label',
          icon: IconType.Info,
          iconTooltip: 'Add or update a text',
          errorLabel: 'Error message'
        }
      }
    );

    expect(spectator.query('.content')).not.toHaveClass(['show-border', 'error-border']);
    expect(spectator.query('.content')).toExist();

    const labels = spectator.queryAll(LabelComponent);
    expect(labels[0].label).toEqual('Label');
    expect(labels[1].label).toEqual('Error message');

    const icon = spectator.query(IconComponent);
    expect(icon?.icon).toEqual(IconType.Info);
  });

  test('should show optional form field data', () => {
    const spectator = hostFactory(
      `
    <ht-form-field [label]="label" [isOptional]="isOptional" [iconTooltip]="iconTooltip">
    </ht-form-field>`,
      {
        hostProps: {
          label: 'Label',
          icon: IconType.Info,
          iconTooltip: 'Add or update a text',
          isOptional: true
        }
      }
    );
    const labels = spectator.queryAll(LabelComponent);
    expect(labels[0].label).toEqual('Label');
    expect(labels[1].label).toEqual('(Optional)');
  });

  test('should show error when showFormError, errorLabel and showBorder is present', () => {
    const spectator = hostFactory(
      `
    <ht-form-field [label]="label" [showFormError]="showFormError" [errorLabel]="errorLabel" [showBorder]="showBorder">
    </ht-form-field>`,
      {
        hostProps: {
          label: 'Label',
          errorLabel: 'Invalid Form element',
          showFormError: true,
          showBorder: true
        }
      }
    );
    expect(spectator.query('.content')).toHaveClass(['content', 'show-border', 'error-border']);

    expect(spectator.query('.error')).toExist();

    const labels = spectator.queryAll(LabelComponent);
    expect(labels[0].label).toEqual('Label');
    // Error label is shown when showFormError is true
    expect(labels[1].label).toEqual('Invalid Form element');

    spectator.setHostInput({
      showFormError: false
    });

    expect(spectator.query('.error')).not.toExist();
    expect(spectator.query('.content')).toHaveClass(['show-border']);
  });
});
