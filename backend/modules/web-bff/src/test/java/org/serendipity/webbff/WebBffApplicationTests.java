package org.serendipity.webbff;

import org.junit.jupiter.api.Test;
// import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
// import org.springframework.boot.security.oauth2.client.autoconfigure.OAuth2ClientAutoConfiguration;
// import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles({"test"})
// @SpringBootTest(properties = "serendipity-bff.auth.enabled=false")
// @EnableAutoConfiguration(exclude = { OAuth2ClientAutoConfiguration.class })
class WebBffApplicationTests {

	@Test
	void contextLoads() {
	}

}
