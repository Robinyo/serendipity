export interface TaskAction {

  action: string;
  assignee?: string;
  formDefinitionId?: string;
  variables: any[];
  outcome?: string;

}

/*

// https://github.com/flowable/flowable-engine/issues/1471

Complete a Task form:

POST /runtime/tasks/{taskId}
{
 "action": "complete",
 "variables": [
   {
     "name": "var1",
     "value": "test",
     "type": "string"
   }
  ],
  "formDefinitionId": "12345",
  "outcome": "someOutcome"
}

*/
