/*
 * Public API Surface of serendipity-components-lib
 */

// Export runtime classes normally so Angular preserves the DI token metadata
export { Collection } from './lib/components/abstract/collection/collection.js';
export { CollectionFooter } from './lib/components/abstract/collection/footer.js';
export { PaginatedFooter } from './lib/components/abstract/collection/paginated-footer.js';
export { Composite } from './lib/components/abstract/composite/composite.js';
export { Form } from './lib/components/abstract/form/form.js';
export { Item } from './lib/components/abstract/item/item.js';
export { List } from './lib/components/abstract/list/list.js';
export { Tab } from './lib/components/abstract/tab/tab.js';
export { Wizard } from './lib/components/abstract/wizard/wizard.js';
export { ActionBar } from './lib/components/action-bar/action-bar.js';
export { ActivityBar } from'./lib/components/activity-bar/activity-bar.js';
export { CommandBar } from'./lib/components/command-bar/command-bar.js';
export { AlertDialog } from './lib/components/dialogs/alert-dialog/alert-dialog.js';
export { ConfirmDialog } from './lib/components/dialogs/confirm-dialog/confirm-dialog.js';
export { Placeholder } from './lib/components/placeholder/placeholder.js';
export { SnackBar } from './lib/components/snack-bar/snack-bar.js';

// Use "export type" for interfaces to let isolatedModules compile them correctly
export type { ColumnDef } from './lib/models/column.js';
