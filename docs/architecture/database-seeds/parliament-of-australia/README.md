<h1 align="center">Parliament of Australia</h1>

<p align="center">
  <b>Database seeds for the Senate and the House of Representatives as at September 2025</b> </br>
</p>

## ❯ Who is a Senator?

A senator is a member of the Australian Senate, elected to represent a **state** or **territory**. There are 76 senators, 12 
from each state and two each from the Australian Capital Territory and the Northern Territory.

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/serendipity-3.0/docs/architecture/database-seeds/parliament-of-australia/state-map.png">
</p>

### The President of the Senate

The President of the Senate is the presiding officer of the Senate, whose chief function is to guide and regulate the 
proceedings in the Senate. The President is also responsible for the administration of the Department of the Senate. 
The President is a senator who is elected to the position by the members of the Senate.

## ❯ Who is a Member?

There are currently 150 members of the House of Representatives. Each member is elected to represent one geographic 
area of Australia called an **electorate**. Each electorate has approximately the same population.

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/serendipity-3.0/docs/architecture/database-seeds/parliament-of-australia/electorate-map.png">
</p>

### The Speaker of the House of Representatives

The Speaker is the principal office holder in the House of Representatives. They are the House's representative or 
spokesperson and chair its meetings. The Speaker is also responsible for the administration of the Department of the 
House of Representatives. The Speaker is elected from among the 150 members of the House and is usually a person of 
considerable parliamentary experience.

## ❯ Database Seeds (aka Database Initialisation)

Database seeding in Spring Boot with JPA involves populating your database with initial data, which is useful for
development, testing, or providing default application settings. Several methods can be employed for this purpose.

### Implementation

### CommandLineRunner

- Implement CommandLineRunner.
- Override the run() method to execute custom code when the application starts.
- Inject your JPA repositories and use them to save entities with initial data.
- 
This approach provides more programmatic control and allows for complex data generation.

### @Order

When performing database seeding in Spring Boot with JPA, the `@Order` annotation can be used to control the execution 
order of multiple seeders.

Annotate each seeder class with `@Order(value)`. The value parameter is an integer, and seeders with lower values will 
execute before those with higher values.

For example, we need to seed the Political Parties (i.e, create Organisations) before we can create a Relationship 
(e.g., Membership) between a Political Party (an Organisation) and a Senator (an Individual).

```
  | Party                  | Role            | Relationship   | Role               | Party                  |
  | ---------------------- | --------------- | -------------- | ------------------ | ---------------------- |
  | Australian Labor Party | Political Party | Office Holder  | National President | Wayne Swan             |
  | Wayne Swan             | Member          | Membership     | Political Party    | Australian Labor Party |
  | Wayne Swan             | Public Officer  | Office Holder  | Political Party    | Australian Labor Party |
```

Accordingly, we would assign a lower `@Order` value to the Political Party seeder classes and a higher `@Order` value to 
the Senate seeder class.

### CSV files

Senators: [All Senators by Name - Electorate Office](https://www.aph.gov.au/-/media/03_Senators_and_Members/Address_Labels_and_CSV_files/Senators/allsenel.csv) </br>
Members: [All Members by Name](https://www.aph.gov.au/-/media/03_Senators_and_Members/Address_Labels_and_CSV_files/FamilynameRepsCSV.csv)

## Resources

* Spring Boot docs: [Database Initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html)
* Parliament of Australia: [Senators and Members](https://www.aph.gov.au/Senators_and_Members)
* Parliament of Australia: [Contacting Senators and Members](https://www.aph.gov.au/Senators_and_Members/Contacting_Senators_and_Members)
* Parliament of Australia: [Senators and Members - Address labels and CSV files](https://www.aph.gov.au/Senators_and_Members/Contacting_Senators_and_Members/Address_labels_and_CSV_files)
* Australian Electoral Commission: [Current federal electoral divisions](https://www.aec.gov.au/profiles/)
* Australian Electoral Commission: [Political party names and abbreviations](https://www.aec.gov.au/Electorates/party-codes.htm)
* Wikipedia: [Electoral Divisions]( https://en.wikipedia.org/wiki/Divisions_of_the_Australian_House_of_Representatives)
* Wikipedia: [List of political parties in Australia](https://en.wikipedia.org/wiki/List_of_political_parties_in_Australia)
* Computational Methods in the Civic Sphere: [Parsing JSON with jq](http://www.compciv.org/recipes/cli/jq-for-parsing-json/)
