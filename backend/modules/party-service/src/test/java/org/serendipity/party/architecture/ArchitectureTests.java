package org.serendipity.party.architecture;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.springframework.stereotype.Service;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "org.serendipity.party")
public class ArchitectureTests {

  @ArchTest
  public static final ArchRule controllers_should_not_access_repositories =
    noClasses()
      .that().resideInAPackage("..controller..")
      .should().accessClassesThat().resideInAPackage("..repository..");

  @ArchTest
  public static final ArchRule services_should_be_annotated =
    classes()
      .that().haveSimpleNameEndingWith("Service")
      .should().beAnnotatedWith(Service.class);

  @ArchTest
  static final ArchRule repositories_should_only_be_accessed_by_services = classes()
    .that().resideInAPackage("..repository..")
    .should().onlyHaveDependentClassesThat()
    .resideInAnyPackage("..service..", "..repository..");

}
