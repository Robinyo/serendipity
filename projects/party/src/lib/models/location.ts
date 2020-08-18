export class Location {

  public id?: string;

  public fromDate: string;
  public toDate: string;

  constructor(
    public type: string = 'LOCATION',
    public displayName: string = '',
  ) {
    this.fromDate = '';
    this.toDate = '';
  }

}
