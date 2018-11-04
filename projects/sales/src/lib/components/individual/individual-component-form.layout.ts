// https://github.com/udos86/ng-dynamic-forms/blob/master/sample/app/ui-material/material-sample-form.layout.ts

export const MATERIAL_SAMPLE_FORM_LAYOUT = {

  'title': {
    grid: {
      host: 'column-1'
    }
  },

  'givenName': {
    grid: {
      control: 'column-1',
      label: 'column-1'
    }
  }

};

/*

  'title': {
    grid: {
      host: 'column-1',
    }
  },

  'givenName': {
    grid: {
      host: 'column-1',
    }
  }

  'title': {
    grid: {
      container: 'grid-column: 1;',
    }
  },
  'givenName': {
    grid: {
      control: 'grid-column: 1;',
      label: 'grid-column: 1;'
    }
  }

  'title': {
    element: {
      container: 'form-group',
      label: 'control-label'
    },
    grid: {
      control: 'grid-column: 1',
      label: 'grid-column: 1'
    }
  }

export const MATERIAL_SAMPLE_FORM_LAYOUT = {

  'addressStreet': {
    element: {
      host: 'material-form-group'
    }
  }

};

*/
