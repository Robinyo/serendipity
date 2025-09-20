// https://github.com/Alfresco/alfresco-js-api
// https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/activiti-rest-api/model/taskFilterRepresentation.ts
// https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/activiti-rest-api/model/userTaskFilterRepresentation.ts

export interface TaskFilterRepresentation {

  assignment?: string;            // username
  dueAfter?: Date;
  dueBefore?: Date;
  name?: string;                  // 'Where I am the assignee'
  processDefinitionId?: string;
  processDefinitionKey?: string;
  order?: string;                 // 'desc';
  sort?: string;                  // 'createTime';

}

export interface TaskFilterRequestRepresentation {

  filter?: TaskFilterRepresentation;
  filterId?: number;
  start?: number;
  size?: number;

}

export interface UserTaskFilterRepresentation {

  filter?: TaskFilterRepresentation;
  icon?: string;
  id?: number;
  // index?: number;
  name?: string;
  // recent?: boolean;

}

// https://github.com/Alfresco/alfresco-ng2-components
// https://github.com/Alfresco/alfresco-ng2-components/tree/master/lib/process-services/src/lib/task-list/models

// tslint:disable-next-line:no-empty-interface
export interface FilterRepresentationModel extends UserTaskFilterRepresentation {}
