package com.projeto.petitrose.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                // Ativa a configuração do CORS definida abaixo e desabilita o CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // Define a política de sessão como STATELESS (padrão para JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configuração das regras de acesso dos Endpoints
                .authorizeHttpRequests(authorize -> authorize
                        // 1. Rotas Públicas (Sem necessidade de Token)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios/login").permitAll()

                        // 2. Rotas do Funcionário Comum (USER) e Admin (ADMIN)
                        // Permissão para visualizar/gerenciar Pedidos, Comandas, Catálogo e Checkout
                        .requestMatchers("/pedidos/**", "/pedidos").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/comandas/**", "/comandas").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/catalogo/**", "/catalogo").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/checkout/**", "/checkout").hasAnyRole("USER", "ADMIN")

                        // Permitir apenas leitura (GET) de produtos e categorias para o Funcionário montar comandas
                        .requestMatchers(HttpMethod.GET, "/produtos/**", "/produtos").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/categorias/**", "/categorias").hasAnyRole("USER", "ADMIN")

                        // 3. Rotas Exclusivas do Administrador/Gerente (ADMIN apenas)
                        // Cadastrar/Editar/Deletar Produtos e Categorias
                        .requestMatchers(HttpMethod.POST, "/produtos/**", "/produtos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/produtos/**", "/produtos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/produtos/**", "/produtos").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/categorias/**", "/categorias").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categorias/**", "/categorias").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categorias/**", "/categorias").hasRole("ADMIN")

                        // Gerenciamento, Cadastro e visualização de Usuários
                        .requestMatchers("/usuarios/**", "/usuarios").hasRole("ADMIN")

                        // Relatórios, Auditoria, Fluxo de Caixa, Transações e Controle Avançado de Estoque
                        .requestMatchers("/api/relatorios/**").hasRole("ADMIN")
                        .requestMatchers("/relatorios/**", "/relatorios").hasRole("ADMIN")
                        .requestMatchers("/transacoes/**", "/transacoes").hasRole("ADMIN")
                        .requestMatchers("/insumos/**", "/insumos").hasRole("ADMIN")
                        .requestMatchers("/estoque/**", "/estoque").hasRole("ADMIN")

                        // Qualquer outra rota não mapeada exige autenticação
                        .anyRequest().authenticated()
                )
                // Insere o filtro customizado JWT antes do filtro de autenticação padrão do Spring
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}