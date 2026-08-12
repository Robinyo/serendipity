export class ActivityModel {

  // public id?: string | number;

  constructor(
    public id: string | number = '',
    public type: string = 'Activity',
    public subject: string = '',
    public regarding: string = '',
    public priority: string = 'Normal',
    public startDate: string = '',
    public dueDate: string = '',
  ) {}

}
