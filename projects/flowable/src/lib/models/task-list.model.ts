export interface TaskCompleteEvent {

  id: string;

}

// export class TaskModel {
export interface TaskModel {

  id: string;
  url: string;
  owner: string;
  assignee: string;
  name: string;
  description: string;
  createTime: Date;
  dueDate: Date;
  priority: number;
  suspended: boolean;
  taskDefinitionKey: string;
  scopeDefinitionId: string;
  scopeId: string;
  scopeType: string;
  tenantId: string;
  category: string;
  formKey: string;
  parentTaskId: string;
  parentTaskUrl: string;
  executionId: string;
  executionUrl: string;
  processInstanceId: string;
  processInstanceUrl: string;
  processDefinitionId: string;
  processDefinitionUrl: string;

  // variables: any[] = [];
  variables: any[];

}

// export class TaskListModel {
export interface TaskListModel {

  total: number;
  sort: string;
  order: string;
  start: number;
  size: number;

  // data: TaskModel[] = [];
  data: TaskModel[];

  // constructor() {}

}

// export type TaskListModel = TaskModel[];

// https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/process-services/task-list/models/task-list.model.ts
// https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/process-services/task-list/models/task-details.model.ts

/*

            "id": "5df96793-fda4-11e8-aa29-0242ac110002",
            "url": "http://localhost:8080/flowable-task/process-api/runtime/tasks/5df96793-fda4-11e8-aa29-0242ac110002",
            "owner": null,
            "assignee": "admin",
            "delegationState": null,
            "name": "My First Task",
            "description": "My first Flowable task",
            "createTime": "2018-12-12T00:25:02.784Z",
            "dueDate": null,
            "priority": 50,
            "suspended": false,
            "taskDefinitionKey": null,
            "scopeDefinitionId": null,
            "scopeId": null,
            "scopeType": null,
            "tenantId": "",
            "category": null,
            "formKey": null,
            "parentTaskId": null,
            "parentTaskUrl": null,
            "executionId": null,
            "executionUrl": null,
            "processInstanceId": null,
            "processInstanceUrl": null,
            "processDefinitionId": null,
            "processDefinitionUrl": null,
            "variables": []

*/

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

 "total": 1,

    "srot": "id",
    "order": "asc",
    "start": 0,
    "size": 1

*/
