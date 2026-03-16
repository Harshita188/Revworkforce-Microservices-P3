package com.revworkforce.api_gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

/**
 * JWT utility for the API Gateway.
 * The signing secret is injected from the environment variable JWT_SECRET
 * (configured via application.yaml as ${JWT_SECRET}) — never hardcoded.
 */
@Slf4j
@Component
public class JwtUtil {

    private final Key signingKey;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Validates the token and returns its claims.
     *
     * @param token raw JWT string (without "Bearer " prefix)
     * @return parsed {@link Claims}
     * @throws JwtException if the token is expired, malformed, or has an invalid signature
     */
    public Claims validateToken(String token) {
        log.debug("Validating JWT token");
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}