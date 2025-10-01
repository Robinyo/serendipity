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

export interface FilterRepresentationModel extends UserTaskFilterRepresentation {}
