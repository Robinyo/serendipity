/*
 * Public API Surface of serendipity-components-lib
 */

// Export runtime classes normally so Angular preserves the DI token metadata
export { Collection } from './lib/components/abstract/collection/collection';
export { CollectionFooter } from './lib/components/abstract/collection/footer';
export { PaginatedFooter } from './lib/components/abstract/collection/paginated-footer';
export { Composite } from './lib/components/abstract/composite/composite';
export { Form } from './lib/components/abstract/form/form';
export { Item } from './lib/components/abstract/item/item';
export { List } from './lib/components/abstract/list/list';
export { Tab } from './lib/components/abstract/tab/tab';
export { Wizard } from './lib/components/abstract/wizard/wizard';
export { ActionBar } from './lib/components/action-bar/action-bar';
export { ActivityBar } from'./lib/components/activity-bar/activity-bar';
export { CommandBar } from'./lib/components/command-bar/command-bar';
export { AlertDialog } from './lib/components/dialogs/alert-dialog/alert-dialog';
export { ConfirmDialog } from './lib/components/dialogs/confirm-dialog/confirm-dialog';
export { Placeholder } from './lib/components/placeholder/placeholder';
export { SnackBar } from './lib/components/snack-bar/snack-bar';

// Use "export type" for interfaces to let isolatedModules compile them correctly
export type { ColumnDef } from './lib/models/column';



// TODO
export { AbstractComponent } from './lib/components/abstract/component/component';

export { DialogService } from './lib/services/dialogs/dialog';
