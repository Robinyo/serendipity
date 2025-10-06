export class Activity {

  // public id?: string;

  constructor(
    public id: string = '',
    public type: string = 'Activity',
    public subject: string = '',
    public regarding: string = '',
    public priority: string = 'Normal',
    public startDate: string = '',
    public dueDate: string = '',
  ) {}

}
