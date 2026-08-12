export class LocationModel {

  public id?: string | number;

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
