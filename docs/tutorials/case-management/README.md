<h1 align="center">Case Management</h1>

## ❯ Case Management Framework

In Australia there are guidelines, policies, and standards developed by different government agencies and organisations 
to guide practitioners in providing coordinated, client-centred support and care across various sectors, such as 
child protection, health, and family violence. 

These frameworks typically include phases like screening, assessment, planning, and evaluation, emphasising multi-agency 
collaboration, risk assessment, and culturally responsive practices to ensure the safety and well-being of clients 
within their broader social context.

## Case Management

Case management typically include six core elements:
- Client identification and eligibility determination
- Assessment
- Care planning along with goal setting
- Plan implementation
- Plan monitoring
- Transition and discharge

Client identification and eligibility determination
Case finding describes a process involving activities focused upon the identification of patients/clients not currently 
receiving case management services. Establishing rapport consists of building an interpersonal connection between the 
case manager and the patient/client.

Client Assessment
Assessment refers to construct a detailed, comprehensive understanding of the patient/client which includes, 
their healthcare and social needs, their capabilities, and the resources they have access to in their family and community.

Care planning along with goal setting
Planning encompasses the steps necessary to build a care plan that defines 
treatment goals, tasks and actions needed to move towards those goals, access to specific services and supports required 
to achieve the stated goals and final the identification of targeted outcomes that are specific to that the patient/client. 
Navigation encompasses the part of the case management process where the case manager helps guide the patient/client to 
services and supports recognizing and working to remove barriers that can either be anticipated or those that 
unexpectedly arise. Provision of care occurs when the case manager is also part of the treatment team as might happen 
in the mental health setting. For example, where the patient' s/client's case manager might also be part of the therapy 
team providing counseling and skills training.

Plan implementation
Implementation, is the part of the case management program where the plan of care with its varied 
activities and tasks, is set in motion. Coordination is related to navigation but is broader and refers to the myriad 
of facilitations that must occur between and among care providers, service settings, organizations, and institutions 
with the patient/client also being the focus and at the center of this component of the case management process.

Plan monitoring
Monitoring occurs throughout the entire process and is related to seeking ongoing feedback and conducting follow-up as 
necessary to how the plan of care is being implemented and producing results. Evaluation is closely related to 
monitoring but occurs at specific milestones during the case management process to formally determine if the care plan 
helps the patient/client achieve progress towards goals and outcomes. Feedback as a component of case management 
involves communication back to service providers about their services' effectiveness. It supports in assisting the 
patient/client in making progress as defined in the plan of care. Providing education and information encompasses 
helping the patient/client and their family/support system develop a deeper understanding of relevant health and health 
care topics. Advocacy refers to activities directed at empowering the patient/client to pursue services and supports 
and related accommodations and proper entitlements to their circumstances. Supportive counseling describes the case 
manager's effort to consistently provide encouragement and emotional support as the care plan unfolds. 
Administration encompasses the paperwork, report writing, and data gathering and analysis that are part and parcel of 
the modern health care system.

Transition and discharge
Transition describes the process when a client is prepared to move across the healthcare continuum, depending on the 
patient's health and the need for services. The client can be moved home or transferred to another facility for 
further care. Discharge represents the case management process component in which the patient's/client's case reaches 
the point of closure, goals are met, and the patient's needs warrant disengagement with the case management process. 

Finally, community service development occurs when the case management process uncovers a need or service gap within a 
given community. Then the case manager catalyzes efforts to create that service or support to fill that gap.

### Business Process Models

#### Case Management

- Client Identification and Eligibility Determination
- Client Assessment
- Care Planning
- Plan Implementation
- Plan Monitoring
- Plan Evaluation and Outcomes

#### Processes

Process: Client Identification and eligibility determination

```
Model name: Client Identification and Eligibility Determination
Model key: client-identification-and-eligibility-determination
```

Process: Client Assessment

```
Model name: Client Assessment
Model key: client-assessment
```

Process: Care Planning

```
Model name: Care Planning
Model key: care-planning
```

Process: Plan Implementation

```
Model name: Plan Implementation
Model key: plan-implementation
```

Process: Care Monitoring

```
Model name: Care Monitoring
Model key: plan-monitoring
```

Process: Plan Evaluation and Outcomes

```
Model name: Plan Evaluation and Outcomes
Model key: plan-evaluation-and-outcomes
```

#### Human Tasks

Human Task: Identify Client

```
Name: Identify Client
Assignments:
Form reference: Identify Client
```

Human Task: Goal Setting

```
Name: Goal Setting
Assignments:
Form reference: Goal
```

Human Task: Goal Verification

```
Name: Goal Verification
Assignments:
Form reference: Goal
```

#### Forms

Form: Identify Client

```
Name name: Identify Client
Form key: identify-client
```

```
Label: Given Name Key: givenName Required: true
Label: Middle Name Key: middleName Required: false
Label: Family Name Key: familyName Required: true
Label: Date of Birth dateOfBirth Required: true
Label: Place of Birth placeOfBirth Required: true
Label: Country of Birth countryOfBirth Required: true Placeholder: Australia
```

Form: Goal

```
Label: Goal Name Key: goalName Required: true
Label: Goal Description Key: goalDescription Required: true
```

Form: Outcomes

```
Label: Outcome Name Key: outcomeName Required: true
Label: Outcome Description Key: outcomeDescription Required: true
```

Create App

```
App definition name: Case Management
App definition key: case-management
```

Publish

You should see something like:

```
AppDeployer  : Processing app resource case-management.app
BpmnDeployer : BpmnDeployer: processing resource assessment.bpmn
BpmnDeployer : BpmnDeployer: processing resource identification-and-eligibility-determination.bpmn
FormDeployer : FormDeployer: processing resource form-identify-client.form
```

## ❯ References

### Case Management

* NIH website: [Case Management](https://www.ncbi.nlm.nih.gov/books/NBK562214/)
* CMSA website: [Case Management - Definitions](https://www.cmsa.org.au/about-us/definitions-of-case-management)
* ISCRR website: [Best Practices for Person-Centred Case Management](https://research.iscrr.com.au/__data/assets/pdf_file/0010/2652715/298_Person_centred-case-management_FINAL.pdf)
