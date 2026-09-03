import { Directive, ViewChild } from '@angular/core';

import { AbstractItem } from 'serendipity-components-lib';
import { FormJsWrapper } from 'serendipity-camunda-lib';

@Directive()
export abstract class AbstractPartyItem<T> extends AbstractItem<T> {

  @ViewChild('formRef') form!: FormJsWrapper;

  //
  // Validation
  //

  public isDirty(): boolean {
    this.logger.info('Contact Component: isDirty()');
    return this.form ? this.form.isDirty() : false;
  }

  public isValid(): boolean {
    this.logger.info('Contact Component: isValid()');
    return this.form ? this.form.isValid() : false;
  }

  //
  // Command Bar Handlers
  //

  public abstract onClose(): void;
  public abstract onDeactivate(): void;
  public abstract onNew(): void;
  public abstract onSave(): void;
  public abstract onSaveAndClose(): void;
  public abstract onTabChanged($event: any): void;

}
