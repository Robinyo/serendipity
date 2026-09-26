# Parliament of Australia

## Overview

The Party Service seeds Australian parliamentary data at startup — political parties as Organisations (Accounts), and 
members of the Senate and House of Representatives as Individuals (Contacts). 

The seed data lives in `backend/modules/party-service/src/main/resources/sample-data/` and is loaded by 
`CommandLineRunner` beans in `backend/modules/party-service/src/main/java/org/serendipity/party/database/seed/au/`.

## Parliament structure

### The Senate

The Senate is the upper house of the Parliament of Australia. There are **76 senators**: 12 from each of the six states, and two from each of the two territories (Australian Capital Territory and Northern Territory).

A senator is elected to represent an entire **state** or **territory**, not a geographic electorate. Senators' offices are in their state or territory capital.

<div class="text--center">
  <img src={require('./state-map.png').default} alt="State Map" />
</div>

### The House of Representatives

The House of Representatives is the lower house. There are currently **150 members**, each elected to represent a single geographic **electorate** (also called a division or seat). Each electorate has approximately the same enrolled population.

A member's electorate office is in the electorate they represent; their parliamentary office is in Canberra.

<div class="text--center">
  <img src={require('./electorate-map.png').default} alt="Electorate Map" />
</div>

### Presiding officers

- **The President of the Senate** — the presiding officer of the Senate, elected by the senators from among their number. Responsible for guiding and regulating Senate proceedings and for the administration of the Department of the Senate.

- **The Speaker of the House of Representatives** — the principal office holder in the House, elected from among the 150 members. The Speaker is the House's representative and chairperson, and is responsible for the administration of the Department of the House of Representatives.

## Seed data on disk

### Directory layout

```
backend/modules/party-service/src/main/resources/sample-data/
├── electoral-divisions.csv          # Current electoral divisions (150 divisions, as at the 2025 federal election)
├── house-of-representatives.csv    # Current members of the House of Representatives (150 members)
├── senate.csv                       # Current members of the Senate (76 senators)
├── 2020/
│   ├── electoral-divisions.csv     # Historical snapshot — 2020 electoral divisions
│   ├── house-of-representatives.csv# Historical snapshot — 2020 House of Representatives
│   └── senate.csv                   # Historical snapshot — 2020 Senate
└── 2025/
    ├── electoral-divisions.csv     # Historical snapshot — 2025 electoral divisions
    ├── house-of-representatives.csv# Historical snapshot — 2025 House of Representatives
    └── senate.csv                   # Historical snapshot — 2025 Senate
```

The top-level `sample-data/` files are the **active** seed data that the `CommandLineRunner` beans read on startup. The `2020/` and `2025/` subdirectories are **historical snapshots** retained as working versions — archived copies of the CSVs as they were at those points in time. They are not read by the seed classes; they exist for reference and to preserve the record of how the data changed between elections.

The seed classes on disk are:

| Class | File read | What it seeds |
|---|---|---|
| `ElectoralDivisions` (`@Order(1)`) | `sample-data/electoral-divisions.csv` | `ElectoralDivision` entities — name, state, area, date gazetted, latitude, longitude |
| Individual political party seeders | (no CSV — hardcoded) | One `Organisation` per political party, seeded before members |
| `Senate` (`@Order(Ordered.LOWEST_PRECEDENCE)`) | `sample-data/senate.csv` | `Individual` + `Name` + `Role`(s) for each senator |
| `HouseOfRepresentatives` (`@Order(LOWEST_PRECEDENCE)`) | `sample-data/house-of-representatives.csv` | `Individual` + `Name` + `Role`(s) + `electorate` for each member |

The political party seeders run at lower `@Order` values than the member seeds, so the party Organisations exist before the membership relationships are created.

## Seed classes and execution order

All seed classes implement `CommandLineRunner` and are annotated with `@Order`. Lower values execute first.

**Execution order:**

1. **`ElectoralDivisions`** — `@Order(1)`. Seeds the 150 electoral divisions. Runs first because later seeds may reference division names.
2. **Individual political party seeders** — each creates one `Organisation` for a political party (Australian Labor Party, Liberal Party of Australia, etc.). These run before the member seeds so that the membership `Role` entities can link each Member/Senator to their party's Organisation.
3. **`Senate`** — `@Order(Ordered.LOWEST_PRECEDENCE)`. Reads `senate.csv` and seeds 76 senators.
4. **`HouseOfRepresentatives`** — `@Order(Ordered.LOWEST_PRECEDENCE)`. Reads `house-of-representatives.csv` and seeds 150 members.

**Idempotency.** The Senate and House of Representatives seeds both check whether data already exists before re-parsing the CSV. If the database is already populated, the seed skips the CSV. This means restarting the application does not duplicate the seed data.

## Political parties

### The `PoliticalParty` enum

The `PoliticalParty` enum in `org.serendipity.party.database.seed.au.PoliticalParty` maps a party **abbreviation** (as it appears in the APH CSV's `Political Party` column) to a display name. The seed classes use this enum to decide:

- which parties to seed as `Organisation`s (each enum value becomes one Organisation)
- which senators/members receive a `Membership` role linking them to their party's Organisation (so the Individual is associated with a Political Party)

### Parties seeded as Organisations

The enum currently covers the major parties that appear in the APH CSV data:

| Abbreviation | Display name | Seeded as Organisation? |
|---|---|---|
| ALP | Australian Labor Party | Yes |
| LP | Liberal Party of Australia | Yes |
| LIB | Liberal Party of Australia | Yes (same Organisation as LP) |
| NATS | National Party of Australia | Yes |
| LNP | Liberal National Party of Queensland | Yes |
| AG | Australian Greens | Yes |
| PHON | Pauline Hanson's One Nation | Yes |
| AV | Australia's Voice | Recognised by enum; no seed class |
| CLP | Country Liberal Party (Northern Territory) | Recognised by enum; no seed class |
| JLN | Jacqui Lambie Network | Recognised by enum; no seed class |
| UAP | United Australia Party | Recognised by enum; no seed class |
| CA | Centre Alliance | Recognised by enum; no seed class |
| KAP | Katter's Australian Party | Recognised by enum; no seed class |

> **Note:** "Recognised by enum; no seed class" means the abbreviation is in the `PoliticalParty` enum so `valueOfAbbreviation` returns the correct constant, but there is no `CommandLineRunner` seed class on disk for the party, so (a) no `Organisation` entity is created, and (b) the seed's membership switch in `Senate.java` and `HouseOfRepresentatives.java` does not include the constant, so members from these parties are saved as Individuals + Contacts without a Membership role linking them to a party. See [Independents and minor parties](#independents-and-minor-parties) for the full explanation.

### Independents and minor parties

Senators and members whose `Political Party` abbreviation is `IND` (Independent) are **not** linked to a party Organisation — they are seeded with the `Membership` role set to `false`, so no party membership relationship is created.

`ON` is an alias for `PHON` — both abbreviations resolve to the same `Pauline Hanson's One Nation` `PoliticalParty` enum constant, so `valueOfAbbreviation("ON")` and `valueOfAbbreviation("PHON")` return the same constant. The enum supports multiple abbreviations per constant (the constructor accepts `String...`), so a single party can be recognised under more than one abbreviation.

**The seed's membership switch is the real gate.** Both `Senate` and `HouseOfRepresentatives` seeds use a `switch` on the resolved `PoliticalParty` constant to decide whether to create a **Membership** role linking the individual to a party Organisation. The switch now lists all thirteen parties that have dedicated seed classes on disk — `AUSTRALIAN_GREENS`, `AUSTRALIAN_LABOR_PARTY`, `LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND`, `LIBERAL_PARTY`, `LIBERAL_PARTY_OF_AUSTRALIA`, `NATIONAL_PARTY_OF_AUSTRALIA`, `PAULINE_HANSONS_ONE_NATION`, `AUSTRALIA_S_VOICE`, `COUNTRY_LIBERAL_PARTY`, `JACQUI_LAMIBE_NETWORK`, `UNITED_AUSTRALIA_PARTY`, `CENTRE_ALLIANCE`, and `KATTER_S_AUSTRALIAN_PARTY` — so members from any of these parties receive a Membership role linking them to their party's Organisation. Senators and members whose abbreviation resolves to any other constant (only `INDEPENDENT` remains) fall through to the `default` branch: no membership role is created, the individual is saved as an Individual + Contact only.

### Extending the enum

If a new party abbreviation appears in a freshly downloaded APH CSV (for example, after a redistribution or a new party registering), add a new enum value with the abbreviation and display name, and re-run the seed. The enum is the single place that controls which parties are recognized by abbreviation lookup. Abbreviations that remain unrecognized are logged and treated as independents (no membership role created).

For a party to be seeded as an `Organisation`, two things must be true:

- the abbreviation must be in the `PoliticalParty` enum (so the member's `Membership` role is created), **and**
- a seed class must exist on disk for that enum constant (so an `Organisation` entity is created), **and**
- the enum constant must be listed in the `switch` statement in both `Senate.java` and `HouseOfRepresentatives.java` (so the seed actually creates the Membership role instead of falling through to `default`).

If any of these three is missing, the party is recognised by the enum but its members are not linked to an Organisation in the database.

## Electoral divisions

### Source

The electoral divisions are seeded from `sample-data/electoral-divisions.csv`, which is sourced from the Australian Electoral Commission's [Current federal electoral divisions](https://www.aec.gov.au/profiles/) page. The CSV was captured on **2026-09-26** and reflects the 150 divisions in force for the 2025 federal election.

### CSV structure

| Column | Meaning |
|---|---|
| `name` | Division name (e.g. `Grayndler`, `Fraser`) |
| `state` | State or territory abbreviation (e.g. `NSW`, `VIC`, `ACT`) |
| `area` | Area in square kilometres |
| `date gazetted` | Date the division was gazetted |
| `latitude` | Latitude of the division |
| `longitude` | Longitude of the division |

### What gets seeded

Each row becomes one `ElectoralDivision` entity with `name`, `state`, `area`, `dateGazetted`, `latitude`, and `longitude`. The `ElectoralDivision` entity stores `latitude` and `longitude` as `String`, not as numeric types — this matches the seed data.

### Data quality note

Some divisions in the CSV have missing or placeholder coordinate values. Divisions that lack reliable coordinate data were seeded with Canberra's coordinates (-35.297, 149.1372) as a placeholder. This is a known limitation of the source data and should be corrected when accurate coordinates become available. Divisions with missing `state` values were also noted in the source CSV and may need manual correction.

## Senators

### Source

Senators are seeded from `sample-data/senate.csv`, sourced from the Parliament of Australia's [All Senators by Name — Electorate Office](https://www.aph.gov.au/-/media/03_Senators_and_Members/Address_Labels_and_CSV_files/Senators/allsenel.csv) CSV file. The CSV was captured on **2026-09-26** and contains the 76 current senators.

### CSV columns used by the seed

| Column | Used for |
|---|---|
| `Title` | `Name.title` |
| `Salutation` | `Name.salutation` |
| `Surname` | `Name.familyName` |
| `First Name` | `Name.givenName` |
| `Other Name` | `Name.middleName` |
| `Preferred Name` | `Name.preferredName` |
| `Initials` | `Name.initials` |
| `Post Nominals` | `Name.honorific` |
| `State` | Senator's state/territory (informational — not linked to an ElectoralDivision) |
| `Political Party` | Party abbreviation → `PoliticalParty` enum → membership role decision |
| `Gender` | `Individual.sex` |
| Electorate address fields | Senator's electorate office address (not seeded as an Address entity) |
| `Parliamentary Titles` | Ministerial/portfolio titles (informational — not seeded) |

Columns beyond `Gender` (electorate address, label address, parliamentary titles) are present in the CSV but are **not** currently used to seed entities. They are retained in the CSV for reference.

### How a senator row becomes entities

For each senator row, the seed creates:

1. A **`Name`** entity from the name columns (`Title`, `Salutation`, `Surname`, `First Name`, `Other Name`, `Preferred Name`, `Initials`, `Post Nominals`)
2. A **`Party`** entity (individual type) with `displayName` built from `Title` + `Given Name` + `Family Name`
3. An **`Individual`** entity linked to the Party, with the `Name`, `sex` (from `Gender`), and a constructed email (`givenName.surname@aph.gov.au`)
4. Optionally, **`Role`** entities:
    - A **Membership** role linking the individual to their political party's Organisation — created only if the resolved `PoliticalParty` constant is one of the seven listed in the seed's `switch` statement (`AUSTRALIAN_GREENS`, `AUSTRALIAN_LABOR_PARTY`, `LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND`, `LIBERAL_PARTY`, `LIBERAL_PARTY_OF_AUSTRALIA`, `NATIONAL_PARTY_OF_AUSTRALIA`, `PAULINE_HANSONS_ONE_NATION`) **and** a seed class exists on disk for that party (so the `Organisation` lookup succeeds). Senators from any other party (including `IND` and the newer minor parties `AV`, `CLP`, `JLN`, `UAP`, `CA`, `KAP`) are saved as Individuals + Contacts without a Membership role.
    - A **Contact** role (always created, linking the individual to an Account)

The senator's `State` column is read but not currently linked to anything in the data model. A senator represents a whole state or territory, so there is no single electorate to link to.

## Members of the House of Representatives

### Source

Members are seeded from `sample-data/house-of-representatives.csv`, sourced from the Parliament of Australia's [All Members by Name](https://www.aph.gov.au/-/media/03_Senators_and_Members/Address_Labels_and_CSV_files/FamilynameRepsCSV.csv) CSV file. The CSV was captured on **2026-09-26** and contains the 150 current members.

### CSV columns used by the seed

| Column | Used for |
|---|---|
| `Honorific` | `Name.title` |
| `Salutation` | `Name.salutation` |
| `Post Nominals` | `Name.honorific` |
| `Surname` | `Name.familyName` |
| `First Name` | `Name.givenName` |
| `Other Name` | `Name.middleName` |
| `Preferred Name` | `Name.preferredName` |
| `Initials` | `Name.initials` |
| `Electorate` | `Individual.electorate` (the division name, e.g. `Grayndler`) |
| `State` | Member's state (informational — not currently used to link to an ElectoralDivision) |
| `Political Party` | Party abbreviation → `PoliticalParty` enum → membership role decision |
| `Gender` | `Individual.sex` |
| Electorate address / phone fields | Member's electorate office details (not seeded as entities) |
| `Parliamentary Title` | Role title (e.g. "Prime Minister", "Deputy Prime Minister") — informational |
| `Ministerial Title` | Ministerial portfolio — informational |

Columns beyond `Gender` are present in the CSV but are **not** currently used to seed entities, with one exception: the `Electorate` column is stored on the `Individual` entity as `electorate` — the name of the division the member represents.

### How a member row becomes entities

For each member row, the seed creates:

1. A **`Name`** entity from the name columns
2. A **`Party`** entity (individual type) with `displayName` built from `Honorific` + `Given Name` + `Family Name`
3. An **`Individual`** entity linked to the Party, with `Name`, `sex`, `email` (`givenName.surname@aph.gov.au`), and `electorate` (from the `Electorate` column)
4. Optionally, **`Role`** entities:
    - A **Membership** role linking the individual to their party's Organisation (if the party abbreviation is recognised)
    - A **Contact** role (always created)

The `Electorate` column links the member to the division they represent by name, but the seed does not currently resolve that name to the corresponding `ElectoralDivision` entity. If that linkage is needed, it can be added by looking up the `ElectoralDivision` by name during the seed.

## Refreshing the seed data

The seed data is sourced from live CSVs published by the Parliament of Australia and the Australian Electoral Commission. These are updated after each federal election and periodically as the parliamentary composition changes (e.g. a member vacates a seat and a new member is elected in a by-election).

### General recipe

1. **Download the latest CSVs** from the APH addresses page:
    - [All Senators by Name — Electorate Office](https://www.aph.gov.au/-/media/03_Senators_and_Members/Address_Labels_and_CSV_files/Senators/allsenel.csv) → `sample-data/senate.csv`
    - [All Members by Name](https://www.aph.gov.au/-/media/03_Senators_and_Members/Address_Labels_and_CSV_files/FamilynameRepsCSV.csv) → `sample-data/house-of-representatives.csv`
    - [Current federal electoral divisions](https://www.aec.gov.au/profiles/) → `sample-data/electoral-divisions.csv`
2. **Archive the previous version** by copying the current top-level CSVs into the appropriate versioned snapshot directory (e.g. `sample-data/2026/` for a 2026 update), keeping the `2020/` and `2025/` snapshots as historical records.
3. **Check for new party abbreviations.** Compare the `Political Party` column values in the new CSV against the `PoliticalParty` enum. For each abbreviation not already in the enum:
    - If it's a recognised party, add a new enum value (abbreviation + display name).
    - If the party is already represented under a different abbreviation, map it to the existing enum value.
    - If it's an independent or minor party you don't want to seed as a membership, leave it unrecognised (it will be logged and treated as an independent).
4. **Update the `PoliticalParty` enum** in `backend/modules/party-service/src/main/java/org/serendipity/party/database/seed/au/PoliticalParty.java` if new parties were added.
5. **Sanity-check the row counts.** The Senate should have 76 senators; the House of Representatives should have 150 members (unless a redistribution or by-election has changed the number). The electoral divisions file should have 150 divisions.
6. **Restart the Party Service.** The `CommandLineRunner` seeds will run on startup and populate the database with the new data.

### Historical snapshots

The `2020/` and `2025/` subdirectories are retained as historical records of the CSVs as they were at those points in time. When refreshing the data, copy the outgoing active CSVs into a new versioned directory (e.g. `2026/`) before replacing the top-level files. This preserves a working version history without affecting the active seed.

## Resources

- Spring Boot docs: [Database Initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html)
- Parliament of Australia: [Senators and Members](https://www.aph.gov.au/Senators_and_Members)
- Parliament of Australia: [Contacting Senators and Members](https://www.aph.gov.au/Senators_and_Members/Contacting_Senators_and_Members)
- Parliament of Australia: [Senators and Members — Address labels and CSV files](https://www.aph.gov.au/Senators_and_Members/Contacting_Senators_and_Members/Address_labels_and_CSV_files)
- Australian Electoral Commission: [Current federal electoral divisions](https://www.aec.gov.au/profiles/)
- Australian Electoral Commission: [Political party names and abbreviations](https://www.aec.gov.au/Electorates/party-codes.htm)
- Wikipedia: [Divisions of the Australian House of Representatives](https://en.wikipedia.org/wiki/Divisions_of_the_Australian_House_of_Representatives)
- Wikipedia: [List of political parties in Australia](https://en.wikipedia.org/wiki/List_of_political_parties_in_Australia)
