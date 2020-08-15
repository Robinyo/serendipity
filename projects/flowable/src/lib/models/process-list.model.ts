export interface ProcessModel {

  id?: string;
  url?: string;
  key?: string;
  version?: number;
  name?: string;
  description?: string;
  tenantId?: string;
  deploymentId?: string;
  deploymentUrl?: string;
  resource?: string;
  diagramResource?: string;
  category?: string;
  graphicalNotationDefined?: boolean;
  suspended?: boolean;
  startFormDefined?: boolean;
  hasStartForm?: boolean;

  // businessKey?: string;
  // ended?: Date;
  // processDefinitionCategory?: string;
  // processDefinitionDeploymentId?: string;
  // processDefinitionDescription?: string;
  // processDefinitionId?: string;
  // processDefinitionKey?: string;
  // processDefinitionName?: string;
  // processDefinitionVersion?: number;
  // started?: Date;
  // startedBy?: LightUserRepresentation;
  // variables?: RestVariable[];

}

// tslint:disable-next-line:max-line-length
// https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/process-services/src/lib/process-list/models/process-instance.model.ts

export interface ProcessListModel {

  size: number;
  total: number;
  start: number;
  data: ProcessModel [];

  // length: number;

}

// https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/process-services/src/lib/process-list/models/process-list.model.ts
