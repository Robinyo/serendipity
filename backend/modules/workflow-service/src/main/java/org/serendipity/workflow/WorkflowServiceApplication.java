package org.serendipity.workflow;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.context.annotation.Profile;

@SpringBootApplication
// @Profile({"dev", "test", "prod"})
@Slf4j
public class WorkflowServiceApplication {

	public static void main(String[] args) {

    log.info("Workflow Service -> main()");

    SpringApplication.run(WorkflowServiceApplication.class, args);

	}

}
