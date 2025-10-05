export enum TaskAction {

  COMPLETE = 'complete',
  CLAIM = 'claim',
  DELEGATE = 'delegate',
  RESOLVE = 'resolve'

}

export interface TaskActionRequestModel {

  action?: string;
  assignee?: string;
  formDefinitionId?: string;
  outcome?: string;
  variables?: any[];
  transientVariables?: any[];

}

// https://github.com/flowable/flowable-engine/blob/master/modules/flowable-rest/src/main/java/org/flowable/rest/service/api/runtime/task/TaskActionRequest.java
