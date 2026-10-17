import { html } from 'htm/preact';

// Utility to evaluate dot-notation paths like "organisation.displayName"
function getValueByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function SearchField(props: any) {
  const { disabled, field, readonly, value, eventBus } = props;
  const { id, label, description, key } = field;

  const getDisplayValue = (): string => {
    // 1. Target the root data structure
    const rootData = props.data || props.model || props.initialData || (typeof value === 'object' ? value : null);

    // 2. First Priority: Evaluate dot-notation key (e.g., "organisation.displayName")
    if (rootData && key && key.includes('.')) {
      const nestedVal = getValueByPath(rootData, key);
      if (nestedVal !== undefined && nestedVal !== null) {
        return typeof nestedVal === 'object'
          ? (nestedVal.displayName || nestedVal.name || JSON.stringify(nestedVal))
          : String(nestedVal);
      }
    }

    // 3. Primitive string/number/boolean values
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);

    // 4. Object value fallback
    if (typeof value === 'object' && value !== null) {
      return value.displayName || value.name || value.label || value.value || '';
    }

    return '';
  };

  const displayValue = getDisplayValue();

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled || readonly) return;

    // 🚀 Pass key directly alongside field and value
    const eventData = {
      key: field.key,          // e.g. "organisation.displayName"
      field,
      value: displayValue,
      rawValue: value
    };

    // Custom DOM event for Angular wrapper listener
    const domEvent = new CustomEvent('searchFieldButtonClick', {
      bubbles: true,
      composed: true,
      detail: eventData
    });
    (event.currentTarget as HTMLElement).dispatchEvent(domEvent);
  };

  const labelElement = label
    ? html`<label class="fjs-form-field-label" for=${id}>${label}</label>`
    : null;

  const descriptionElement = description
    ? html`<div class="fjs-form-field-description">${description}</div>`
    : null;

  return html`
    <div class="fjs-form-field fjs-form-field-search-field">
      ${labelElement}

      <div class="fjs-input-group">
        <button
          type="button"
          class="fjs-input-group-addon"
          disabled=${disabled || readonly}
          onClick=${handleClick}
          aria-label="Search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <input
          id=${id}
          class="fjs-input"
          type="text"
          value=${displayValue}
          readonly=${true}
          disabled=${disabled}
        />
      </div>

      ${descriptionElement}
    </div>
  `;
}

SearchField.config = {
  type: 'searchField',
  name: 'Search Field',
  label: 'Search Field',
  group: 'basic-input',
  emptyValue: '',
  sanitize: (val: any) => val,
  create: (options = {}) => ({
    ...options
  })
};


/*

import { html } from 'htm/preact';

export function SearchField(props: any) {
  const { disabled, field, readonly, value, eventBus } = props;
  const { id, label, description } = field;

  // 1. Resolve string value safely to prevent [object Object] in text fields
  const displayValue = typeof value === 'object' && value !== null
    ? (value.name || value.label || value.value || '')
    : (value ?? '');

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    const eventData = { field, value: displayValue };

    // Fire via eventBus
    if (eventBus) {
      eventBus.fire('searchFieldButton.click', eventData);
    }

    // Fire DOM CustomEvent for Angular listener
    const domEvent = new CustomEvent('searchFieldButtonClick', {
      bubbles: true,
      composed: true,
      detail: eventData
    });
    (event.currentTarget as HTMLElement).dispatchEvent(domEvent);
  };

  const labelElement = label
    ? html`<label class="fjs-form-field-label" for=${id}>${label}</label>`
    : null;

  const descriptionElement = description
    ? html`<div class="fjs-form-field-description">${description}</div>`
    : null;

  return html`
    <div class="fjs-form-field fjs-form-field-search-field">
      ${labelElement}

      <div class="fjs-input-group">
        <button
          type="button"
          class="fjs-input-group-addon"
          disabled=${disabled || readonly}
          onClick=${handleClick}
          aria-label="Search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <input
          id=${id}
          class="fjs-input"
          type="text"
          value=${displayValue}
          readonly=${true}
          disabled=${disabled}
        />
      </div>

      ${descriptionElement}
    </div>
  `;
}

// Attach static config
SearchField.config = {
  type: 'searchField',
  name: 'Search Field',
  label: 'Search Field',
  group: 'basic-input',
  emptyValue: '',
  sanitize: (value: any) => (typeof value === 'string' ? value : ''),
  create: (options = {}) => ({
    ...options
  })
};

*/

/*

import { html } from 'htm/preact';

export function SearchField(props: any) {
  const { disabled, field, readonly, value, eventBus } = props;
  const { id, label, description } = field;

  // 1. Resolve string value safely
  const displayValue = typeof value === 'object' && value !== null
    ? (value.name || value.label || value.value || '')
    : (value ?? '');

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    const eventData = { field, value: displayValue };

    // Fire through eventBus
    if (eventBus) {
      eventBus.fire('searchFieldButton.click', eventData);
    }

    // Fire native DOM CustomEvent for Angular listener
    const domEvent = new CustomEvent('searchFieldButtonClick', {
      bubbles: true,
      composed: true,
      detail: eventData
    });
    (event.currentTarget as HTMLElement).dispatchEvent(domEvent);
  };

  // Pre-render sub-templates to prevent nested htm parsing conflicts
  const labelElement = label
    ? html`<label class="fjs-form-field-label" for=${id}>${label}</label>`
    : null;

  const descriptionElement = description
    ? html`<div class="fjs-form-field-description">${description}</div>`
    : null;

  return html`
    <div class="fjs-form-field fjs-form-field-search-field">
      ${labelElement}

      <div class="fjs-input-group">
        <button
          type="button"
          class="fjs-input-group-addon"
          disabled=${disabled || readonly}
          onClick=${handleClick}
          aria-label="Search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <input
          id=${id}
          class="fjs-input"
          type="text"
          value=${displayValue}
          readonly=${true}
          disabled=${disabled}
        />
      </div>

      ${descriptionElement}
    </div>
  `;
}

// Config required by form-js
SearchField.config = {
  type: 'searchField',
  name: 'Search Field',
  label: 'Search Field',
  group: 'basic-input',
  emptyValue: '',
  sanitize: (value: any) => (typeof value === 'string' ? value : ''),
  create: (options = {}) => ({
    ...options
  })
};

*/


/*

import { html } from 'htm/preact';

export function SearchField(props: any) {
  const { disabled, field, readonly, value, eventBus } = props;
  const { id, label, description } = field;

  // 1. Resolve string value safely
  const displayValue = typeof value === 'object' && value !== null
    ? (value.name || value.label || value.value || '')
    : (value ?? '');

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    const eventData = { field, value: displayValue };

    if (eventBus) {
      eventBus.fire('searchFieldButton.click', eventData);
    }

    const domEvent = new CustomEvent('searchFieldButtonClick', {
      bubbles: true,
      composed: true,
      detail: eventData
    });
    (event.currentTarget as HTMLElement).dispatchEvent(domEvent);
  };

  // 2. Pre-render optional elements cleanly without nested html`` calls
  const labelElement = label
    ? html`<label class="fjs-form-field-label" for=${id}>${label}</label>`
    : null;

  const descriptionElement = description
    ? html`<div class="fjs-form-field-description">${description}</div>`
    : null;

  return html`
    <div class="fjs-form-field fjs-form-field-search-field">
      ${labelElement}

      <div class="fjs-input-group">
        <button
          type="button"
          class="fjs-input-group-addon"
          disabled=${disabled || readonly}
          onClick=${handleClick}
          aria-label="Search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <input
          id=${id}
          class="fjs-input"
          type="text"
          value=${displayValue}
          readonly=${true}
          disabled=${disabled}
        />
      </div>

      ${descriptionElement}
    </div>
  `;
}

SearchField.config = {
  type: 'searchField',
  name: 'Search Field',
  label: 'Search Field',
  group: 'basic-input',
  emptyValue: '',
  sanitize: (value: any) => (typeof value === 'string' ? value : ''),
  create: (options = {}) => ({
    ...options
  })
};

*/



/*

import { html } from 'htm/preact';

export function SearchField(props: any) {
  const { disabled, field, readonly, value, eventBus } = props;
  const { id, label, description } = field;

  // 1. Resolve value safely to avoid rendering '[object Object]'
  const displayValue = typeof value === 'object' && value !== null
    ? (value.name || value.label || value.value || '')
    : (value ?? '');

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    const eventData = { field, value: displayValue };

    // 2a. Fire through form-js internal eventBus (if passed in module)
    if (eventBus) {
      eventBus.fire('searchFieldButton.click', eventData);
    }

    // 2b. Fire native DOM event as a reliable fallback for Angular
    const domEvent = new CustomEvent('searchFieldButtonClick', {
      bubbles: true,
      composed: true,
      detail: eventData
    });
    (event.currentTarget as HTMLElement).dispatchEvent(domEvent);
  };

  return html`
    <div class="fjs-form-field fjs-form-field-search-field">
      ${label && html`<label class="fjs-form-field-label" for="${id}">${label}</label>`}

      <div class="fjs-input-group">
        <button
          type="button"
          class="fjs-input-group-addon"
          disabled="${disabled}"
          onClick="${handleClick}"
          aria-label="Search"
        >
          <!-- Search Glass Icon -->
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <input
          id="${id}"
          class="fjs-input"
          type="text"
          value="${displayValue}"
          readonly
          disabled="${disabled}"
        />
      </div>

      ${description && html`<div class="fjs-form-field-description">${description}</div>`}
    </div>
  `;
}

SearchField.config = {
  type: 'searchField',
  name: 'Text Field with Icon Button',
  label: 'Icon Text Button',
  group: 'basic-input',
  emptyValue: '',
  create: (options = {}) => ({
    ...options
  })
};

*/




/*

import { html } from 'htm/preact';

export function SearchField(props: any) {
  const { disabled, field, readonly, value = '' } = props;
  const { id, label, description, iconCssClass = 'fjs-icon-search' } = field;

  // Dispatch custom form-js event when the icon button is clicked
  const handleClick = (event: any) => {
    event.preventDefault();
    if (disabled || readonly) return;

    if (props.onEvent) {
      props.onEvent({
        type: 'searchFieldButton.click',
        data: { field, value }
      });
    }
  };

  return html`
    <div class="fjs-form-field fjs-form-field-search-field">
      ${label && html`<label class="fjs-form-field-label" for="${id}">${label}</label>`}

      <div class="fjs-input-group">
        <button
          type="button"
          class="fjs-input-group-addon"
          disabled="${disabled || readonly}"
          onClick="${handleClick}"
          aria-label="Action"
        >
          <!-- SVG Icon matching form-js native layout -->
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 3.5C2 2.67157 2.67157 2 3.5 2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5Z"
              stroke="currentColor"
              stroke-width="1.2"
            />
            <path d="M5 2V4M11 2V4M2 6H14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </button>

        <input
          id="${id}"
          class="fjs-input"
          type="text"
          value="${value}"
          readonly
          disabled="${disabled}"
        />
      </div>

      ${description && html`<div class="fjs-form-field-description">${description}</div>`}
    </div>
  `;
}

SearchField.config = {
  type: 'searchField',
  name: 'Text Field with Icon Button',
  label: 'Icon Text Button',
  group: 'basic-input',
  emptyValue: '',
  create: (options = {}) => ({
    ...options
  })
};

*/
