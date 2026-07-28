package com.projeto.petitrose;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "api.security.token.secret=chave-secreta-de-teste-petit-rose-12345")
class PetitroseApplicationTests {

    @Test
    void contextLoads() {
    }

}