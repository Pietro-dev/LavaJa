package io.github.pietro_dev.lavajaapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "JWT_SECRET=seu-token-secreto-para-testes-aqui-123456",
        "api.security.token.secret=seu-token-secreto-para-testes-aqui-123456"
})
class LavajaApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
