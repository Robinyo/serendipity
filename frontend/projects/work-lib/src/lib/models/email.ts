export class Email {

  // public id?: string;

  constructor(
    public from: string,
    public to: string,
    // public cc: string,
    // public bcc: string,
    public subject: string,
    public text: string,
    public html: string = '<b>Hello World</b>'
  ) {}

}
