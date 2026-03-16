package com.revworkforce.api_gateway.filter;

import com.revworkforce.api_gateway.util.JwtUtil;
import com.revworkforce.api_gateway.util.RouteValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Gateway filter that validates a JWT Bearer token on every protected route.
 *
 * <p>Improvements over the original:
 * <ul>
 *   <li>JwtUtil is injected as a Spring bean — secret comes from env var, not hard-code.</li>
 *   <li>Missing / invalid / expired tokens always return HTTP 401 UNAUTHORIZED.</li>
 *   <li>Exceptions from JWT parsing are caught and logged; the request is rejected.</li>
 * </ul>
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final JwtUtil jwtUtil;
    private final RouteValidator validator;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil, RouteValidator validator) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
        this.validator = validator;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            // 1. Check if the route is secured
            if (validator.isSecured.test(exchange.getRequest())) {
                // Check Authorization header is present
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    log.warn("Missing Authorization header for path: {}", exchange.getRequest().getPath());
                    return unauthorized(exchange.getResponse());
                }

                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

                // 2. Validate Bearer prefix
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    log.warn("Authorization header does not start with Bearer");
                    return unauthorized(exchange.getResponse());
                }

                String token = authHeader.substring(7); // strip "Bearer "

                // 3. Validate token — any JwtException returns 401
                try {
                    jwtUtil.validateToken(token);
                } catch (Exception e) {
                    log.warn("Invalid or expired JWT token: {}", e.getMessage());
                    return unauthorized(exchange.getResponse());
                }
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> unauthorized(ServerHttpResponse response) {
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

    /** Config class required by AbstractGatewayFilterFactory (no fields needed here). */
    public static class Config {
    }
}