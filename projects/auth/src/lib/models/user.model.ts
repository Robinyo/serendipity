export interface User {

  // id?: string;
  username: string;
  password: string;
  givenName?: string;          // firstName
  familyName?: string;         // lastName
  displayName?: string;
  // url?: string;
  email?: string;
  photoUrl?: string;           // pictureUrl

}

/*

{
    "data": [
        {
            "id": "admin",
            "firstName": "Test",
            "lastName": "Administrator",
            "displayName": null,
            "url": "http://localhost:8080/flowable-task/process-api/identity/users/admin",
            "email": "admin@flowable.org",
            "pictureUrl": null
        }
    ],
    "total": 1,
    "start": 0,
    "sort": "id",
    "order": "asc",
    "size": 1
}

*/
