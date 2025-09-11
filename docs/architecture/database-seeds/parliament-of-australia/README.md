<h1 align="center">Parliament of Australia</h1>

<p align="center">
  <b>Database seeds for the Senate and the House of Representatives as at September 2025</b> </br>
</p>

## ❯ Who is a Senator?

A senator is a member of the Australian Senate, elected to represent a **state** or **territory**. There are 76 senators, 12 
from each state and two each from the Australian Capital Territory and the Northern Territory.

### The President of the Senate

The President of the Senate is the presiding officer of the Senate, whose chief function is to guide and regulate the 
proceedings in the Senate. The President is also responsible for the administration of the Department of the Senate. 
The President is a senator who is elected to the position by the members of the Senate.

## ❯ Who is a Member?

There are currently 150 members of the House of Representatives. Each member is elected to represent one geographic 
area of Australia called an **electorate**. Each electorate has approximately the same population.

### The Speaker of the House of Representatives
[repository](../../../repository)
The Speaker is the principal office holder in the House of Representatives. They are the House's representative or 
spokesperson and chair its meetings. The Speaker is also responsible for the administration of the Department of the 
House of Representatives. The Speaker is elected from among the 150 members of the House and is usually a person of 
considerable parliamentary experience.

## ❯ Database Seeds

Database seeding in Spring Boot with JPA involves populating your database with initial data, which is useful for
development, testing, or providing default application settings. Several methods can be employed for this purpose.

### Implementation

For example, Spring `ApplicationRunner` or `CommandLineRunner`.

- Implement ApplicationRunner or CommandLineRunner and override the run method.
- Inside the run method, inject your JPA repositories and use them to persist entities with initial data.
- These runners are executed after the Spring application context has been fully loaded, allowing access to all beans, including repositories.








## Resources

* Parliament of Australia: [Senators and Members](https://www.aph.gov.au/Senators_and_Members)
* Parliament of Australia: [Contacting Senators and Members](https://www.aph.gov.au/Senators_and_Members/Contacting_Senators_and_Members)
* Parliament of Australia: [Senators and Members - Address labels and CSV files](https://www.aph.gov.au/Senators_and_Members/Contacting_Senators_and_Members/Address_labels_and_CSV_files)
* Australian Electoral Commission: [Current federal electoral divisions](https://www.aec.gov.au/profiles/)
* Wikipedia: [List of political parties in Australia](https://en.wikipedia.org/wiki/List_of_political_parties_in_Australia)
* Computational Methods in the Civic Sphere: [Parsing JSON with jq](http://www.compciv.org/recipes/cli/jq-for-parsing-json/)
