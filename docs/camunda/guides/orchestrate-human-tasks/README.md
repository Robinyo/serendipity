<h1 align="center">Orchestrate Human Tasks</h1>

There is a well known joke about the two most difficult problems in computer science, it goes something like this:

> What are the two most difficult problems in computer science?
> Naming things, cache invalidation and off-by-one errors.

There are no official naming conventions for BPMN, but organisations typically rely on a controlled vocabulary and 
best-practice guidelines. A standardised glossary prevents ambiguity, eliminates technical jargon where possible, and 
keeps process diagrams understandable to all stakeholders across the business.

Universal Naming Principles
- Avoid element types: Do not include the element type in the label (e.g., name a task Generate Invoice, not Generate 
  Invoice Task).
- No articles/pronouns: Drop unnecessary words like "the," "a," or "all" to keep labels concise.
- Avoid abbreviations: Spell out terms unless they are strictly defined as part of the organisation's enterprise-wide 
  controlled vocabulary.

Element-Specific Conventions
Applying consistent grammar structures to different BPMN elements is the foundation of any modeling convention:
- Processes & Pools: Use an object and a nominalised verb to define the purpose of the whole process (e.g., Order 
  Fulfillment, Invoice Processing). Give the pool the same name as the process it contains.
- Tasks & Subprocesses: Use an active Verb + Noun phrase (e.g., Submit Application, Approve Request). For subprocesses,
  use a nominalised verb (e.g., Reviewing Application).
- Events: Name events based on the state of an object.
    - Start Events: Describe the trigger (e.g., Customer Order Received).
    - End Events: Describe the final state or outcome (e.g., Order Shipped).
- Gateways: Label outgoing sequence flows with the conditions that follow them (e.g., Approved or Rejected). 
  Alternatively, phrase the gateway as a question (e.g., Is order valid?) and label paths as Yes or No.

Establishing a Controlled Vocabulary
For enterprise-level modeling, you should enforce a centralised data dictionary or controlled vocabulary:
- Glossary of terms: Standardise the nouns and objects used in your processes. For instance, require that everyone uses 
  the word Employee instead of Staff, Worker, or Team Member.
- Standardised verbs: Limit the vocabulary to a set of approved business verbs (e.g., Approve, Create, Update, Notify, Delete, Archive).
- Domain definitions: Define technical acronyms and specific business rules in a shared repository so every modeller 
  references the exact same terms.

## ❯ Get started with human task orchestration

See: [Get started with human task orchestration](https://docs.camunda.io/docs/guides/orchestrate-human-tasks/?install=sm)

## ❯ References

### Camunda Best Practices
* Camunda docs: [Creating readable process models](https://docs.camunda.io/docs/components/best-practices/modeling/creating-readable-process-models/)
* Camunda docs: [Naming BPMN elements](https://docs.camunda.io/docs/components/best-practices/modeling/naming-bpmn-elements/)
* Camunda docs: [Naming technically relevant IDs](https://docs.camunda.io/docs/components/best-practices/modeling/naming-technically-relevant-ids/)
* Camunda docs: [Modeling beyond the happy path](https://docs.camunda.io/docs/components/best-practices/modeling/modeling-beyond-the-happy-path/)
* Camunda docs: [Modeling with situation patterns](https://docs.camunda.io/docs/components/best-practices/modeling/modeling-with-situation-patterns/)
* Camunda docs: [Building flexibility into BPMN models](https://docs.camunda.io/docs/components/best-practices/modeling/building-flexibility-into-bpmn-models/)


