// tslint:disable-next-line:max-line-length
// https://github.com/flowable/flowable-engine/blob/master/modules/flowable-rest/src/main/java/org/flowable/rest/service/api/runtime/task/TaskActionRequest.java

export enum Action {

  complete = 'complete',
  claim = 'claim',
  delegate = 'delegate',
  resolve = 'resolve'

}

export interface TaskActionRequest {

  action?: string;
  assignee?: string;
  formDefinitionId?: string;
  outcome?: string;
  variables?: any[];
  transientVariables?: any[];

}
