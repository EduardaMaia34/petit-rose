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
                        // Permite requisições de pre-flight do CORS (OPTIONS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()

                        // Usuário e Autenticação
                        .requestMatchers(HttpMethod.POST, "/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios/register").permitAll()
                        .requestMatchers("/produtos/**").permitAll()
                        .requestMatchers("/produtos").permitAll()

                        // Categorias
                        .requestMatchers("/categorias/**").permitAll()
                        .requestMatchers("/categorias").permitAll()

                        // Catálogo, Checkout, Comandas e Pedidos
                        .requestMatchers("/catalogo/**").permitAll()
                        .requestMatchers("/catalogo").permitAll()
                        .requestMatchers("/checkout/**").permitAll()
                        .requestMatchers("/checkout").permitAll()
                        .requestMatchers("/comandas/**").permitAll()
                        .requestMatchers("/comandas").permitAll()

                        // Pedidos
                        .requestMatchers("/pedidos/**").permitAll()
                        .requestMatchers("/pedidos").permitAll()

                        // Estoque e Insumos
                        .requestMatchers("/insumos/**").permitAll()
                        .requestMatchers("/insumos").permitAll()
                        .requestMatchers("/estoque/**").permitAll()
                        .requestMatchers("/estoque").permitAll()

                        // Fluxo de Caixa / Transações
                        .requestMatchers("/transacoes/**").permitAll()
                        .requestMatchers("/transacoes").permitAll()

                        // Qualquer outra rota exige autenticação por Token
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