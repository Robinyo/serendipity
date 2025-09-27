export interface StartProcessModel {

  processDefinitionId?: string;
  businessKey?: string;
  returnVariables?: boolean;
  name?: string;
  variables?: any;

}

export interface ProcessModel {

  id?: string;
  url?: string;
  owner?: string;
  assignee?: string;
  delegationState?: string;
  name?: string;
  description?: string;
  createTime?: Date;
  dueDate?: Date;
  priority?: number;
  suspended?: boolean;
  claimTime?: Date;
  taskDefinitionKey?: string;
  scopeDefinitionId?: string;
  scopeId?: string;
  subScopeId?: string;
  scopeType?: string;
  propagatedStageInstanceId?: string;
  tenantId?: string;
  category?: string;
  formKey?: string;
  parentTaskId?: string;
  parentTaskUrl?: string;
  executionId?: string;
  executionUrl?: string;
  processInstanceId?: string;
  processInstanceUrl?: string;
  processDefinitionId?: string;
  processDefinitionUrl?: string;
  variables?: any;

}

export interface ProcessListModel {

  size?: number;
  total?: number;
  start?: number;
  data?: ProcessModel [];

  // length: number;

}
