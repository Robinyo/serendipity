export class TaskModel {

  id: string;
  name: string;
  description: string;

}

export type TaskListModel = TaskModel[];

// https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/process-services/task-list/models/task-list.model.ts
// https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/process-services/task-list/models/task-details.model.ts

/*

export class TaskModel {

  id: string;
  name: string;
  description: string;

}

export class TaskListModel {

  size: number;
  total: number;
  start: number;
  length: number;
  data: TaskModel[] = [];

  constructor() {}

}

*/
