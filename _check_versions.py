import json, re

with open('frontend/package.json') as f:
    frontend = json.load(f)
angular_ver = frontend['dependencies']['@angular/core']

with open('backend/pom.xml') as f:
    pom = f.read()

sb = re.search(r'<artifactId>spring-boot-starter-parent</artifactId>\s*<version>(\d+\.\d+\.\d+)</version>', pom)
sc = re.search(r'<spring-cloud.version>(\S+)</spring-cloud.version>', pom)
jv = re.search(r'<java.version>(\d+)</java.version>', pom)

print(f"Angular:      {angular_ver}")
print(f"Spring Boot:  {sb.group(1) if sb else '?'}")
print(f"Spring Cloud: {sc.group(1) if sc else '?'}")
print(f"Java:         {jv.group(1) if jv else '?'}")
