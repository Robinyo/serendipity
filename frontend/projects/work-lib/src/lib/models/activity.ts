export class Activity {

  // public id?: string;

  constructor(
    public id: string = '',
    public type: string = '',
    public subject: string = '',
    public regarding: string = '',
    public priority: string = '',
    public startDate: string = '',
    public dueDate: string = '',
  ) {}

}
