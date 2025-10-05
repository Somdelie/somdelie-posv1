package com.somdelie_pos.somdelie_pos.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
public class SecurityConfig {

    /**
     * Think of this like `app.use()` in Express.
     * <p>
     * - Sets up global security middlewares.
     * - Stateless sessions = no server-side sessions (like using JWTs in Express).
     * - Route protection:
     *      /api/super-admin/** → only ADMIN role
     *      /api/** → must be logged in
     *      everything else → public
     * - Adds JwtValidator middleware (like a custom Express JWT middleware).
     * - Disables CSRF (not needed for REST APIs).
     * - Applies CORS policy (like `app.use(cors({...}))` in Express).
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .sessionManagement(management ->
                        management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize ->
                        authorize.requestMatchers("/api/super-admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/**").authenticated()
                                .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .build();
    }

    /**
     * This is the Spring equivalent of Express's `cors()` middleware.
     * <p>
     * It defines:
     * - Which React frontends (origins) can call this API.
     * - Which HTTP methods are allowed.
     * - Which headers can be sent from frontend.
     * - Which headers the frontend can see in the response.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();

        // Get allowed origins from environment variable, fallback to localhost
        String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");
        List<String> allowedOrigins;

        if (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) {
            // Split comma-separated origins from environment variable
            allowedOrigins = Arrays.asList(allowedOriginsEnv.split(","));
            System.out.println("✅ Using ALLOWED_ORIGINS from environment: " + allowedOrigins);
        } else {
            // Default for local development
            allowedOrigins = Arrays.asList(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://somdelie-posv1.vercel.app",
                    "https://somdelie-posv1-hgpco1oyv-somdelies-projects.vercel.app"
            );
            System.out.println("⚠️ ALLOWED_ORIGINS not set, using defaults: " + allowedOrigins);
        }

        cfg.setAllowedOrigins(allowedOrigins);

        // Allowed HTTP methods
        cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow credentials (cookies, auth headers) → like `{ credentials: true }` in Express CORS
        cfg.setAllowCredentials(true);

        // Allow all request headers
        cfg.setAllowedHeaders(Collections.singletonList("*"));

        // Expose certain response headers so frontend can read them
        cfg.setExposedHeaders(Arrays.asList("Authorization", "Cache-Control"));

        // Cache CORS preflight (OPTIONS) response for 1 hour
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

}
