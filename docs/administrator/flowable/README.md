<h1 align="center">Working with Flowable</h1>

## ❯ Flowable

### LDAP

```


```





### Groups

Groups manage groups of users. Serendipity uses OpenLDAP to store groups and user credentials.

Serendipity has two default groups:

- Team Member
- Team Leader (Approver)

**Note**: Groups must also be configured in Keycloak.

```

...

# Groups

dn: cn=Team Leader, ou=groups, dc=flowable,dc=org
changetype: add
objectclass: top
objectclass: groupOfUniqueNames
cn: Team Leader
ou: Team Leader
uniqueMember: uid=rob.ferguson,ou=users,dc=flowable,dc=org

dn: cn=Team Member, ou=groups, dc=flowable,dc=org
changetype: add
objectclass: top
objectclass: groupOfUniqueNames
cn: Team Member
ou: Team Member
uniqueMember: uid=rob.ferguson,ou=users,dc=flowable,dc=org
uniqueMember: uid=sean.doyle,ou=users,dc=flowable,dc=org
uniqueMember: uid=robert.russo,ou=users,dc=flowable,dc=org
```


## ❯ References

### Flowable

* Flowable docs: [REST API](https://www.flowable.com/open-source/docs/bpmn/ch14-REST)
* GitHub: [Flowable Default Properties](https://github.com/flowable/flowable-engine/blob/main/modules/flowable-app-rest/src/main/resources/flowable-default.properties)
