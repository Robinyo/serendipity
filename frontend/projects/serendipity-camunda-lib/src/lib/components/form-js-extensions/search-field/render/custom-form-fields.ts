import { SearchField } from './search-field';

export class CustomFormFields {
  static $inject = ['formFields', 'eventBus'];

  constructor(formFields: any, eventBus: any) {
    // 1. Create component wrapper that injects eventBus into props
    const SearchFieldComponent = (props: any) => SearchField({ ...props, eventBus });

    // 2. Attach config statically to the component wrapper
    SearchFieldComponent.config = SearchField.config;

    // 3. Register directly: formFields.register(type, component)
    formFields.register(SearchField.config.type, SearchFieldComponent);
  }
}

export const CustomFormFieldsModule = {
  __init__: ['customFormFields'],
  customFormFields: ['type', CustomFormFields]
};


/*

import { SearchField } from './search-field';

export class CustomFormFields {
  static $inject = ['formFields', 'eventBus'];

  constructor(formFields: any, eventBus: any) {
    // 1. Register the field component configuration
    formFields.register(SearchField.config.type, {
      config: SearchField.config,
      // 2. Wrap the renderer component and pass the eventBus
      component: (props: any) => SearchField({ ...props, eventBus })
    });
  }
}

export const CustomFormFieldsModule = {
  __init__: ['customFormFields'],
  customFormFields: ['type', CustomFormFields]
};


*/



/*

import { SearchField } from './search-field';

export class CustomFormFields {
  static $inject = ['formFields', 'eventBus'];

  constructor(formFields: any, eventBus: any) {
    // 🚀 Pass config as the 3rd parameter: register(type, component, config)
    formFields.register(
      SearchField.config.type,
      (props: any) => SearchField({ ...props, eventBus }),
      SearchField.config
    );
  }
}

export const CustomFormFieldsModule = {
  __init__: ['customFormFields'],
  customFormFields: ['type', CustomFormFields]
};

*/



/*

import { SearchField } from './search-field';

export class CustomFormFields {
  static $inject = ['formFields', 'eventBus'];

  constructor(formFields: any, eventBus: any) {
    // 1. Register the field component configuration
    formFields.register(SearchField.config.type, {
      config: SearchField.config,
      // 2. Wrap the renderer component and pass the eventBus
      component: (props: any) => SearchField({ ...props, eventBus })
    });
  }
}

export const CustomFormFieldsModule = {
  __init__: ['customFormFields'],
  customFormFields: ['type', CustomFormFields]
};

*/



/*

import { SearchField } from './search-field';

export class CustomFormFields {
  static $inject = ['formFields'];

  constructor(formFields: any) {
    // Register custom component type
    formFields.register('searchField', SearchField);
  }
}

export const CustomFormFieldsModule = {
  __init__: ['customFormFields'],
  customFormFields: ['type', CustomFormFields]
};

*/
