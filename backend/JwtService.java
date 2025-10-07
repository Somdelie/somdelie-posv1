package com.somdelie_pos.somdelie_pos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.somdelie_pos.somdelie_pos.modal.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${app.jwt.secret:dev-secret-change-me-please-32-bytes-min}")
    private String secret;

    @Value("${app.jwt.expiration-seconds:604800}")
    private long expirationSeconds;

    private Key signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(User user) {
        // Build claims explicitly (avoids deprecated setClaims/setSubject/etc. in newer jjwt versions)
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", user.getId().toString());
        if (user.getRole() != null) claims.put("role", user.getRole().name());
        if (user.getStore() != null) claims.put("storeId", user.getStore().getId().toString());
        if (user.getBranch() != null) claims.put("branchId", user.getBranch().getId().toString());

        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationSeconds);

        return Jwts.builder()
                .claims(claims)                 // preferred style (jjwt >= 0.11)
                .issuedAt(Date.from(now))        // still acceptable (not deprecated in 0.13)
                .expiration(Date.from(exp))
                // signWith(Key) (jjwt >= 0.12) auto-selects alg from key; fallback uses explicit alg if runtime lacks method
                .signWith(signingKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Parsing / Validation Helpers: try modern verifyWith() path then fallback to legacy setSigningKey() style.

    private Claims parseClaims(String token) {
        Key key = signingKey();
        // Trim possible "Bearer " prefix
        if (token != null && token.startsWith("Bearer ")) token = token.substring(7);
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Throwable first) {
            try {
                return Jwts.parser()
                        .setSigningKey(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
            } catch (Throwable second) {
                throw new JwtException("Unable to parse JWT", second);
            }
        }
    }

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long extractUserId(String token) {
        Claims c = parseClaims(token);
        // We stored subject in "sub" (standard claim) so subject() or get("sub") works depending on API version
        Object sub = c.get("sub");
        if (sub == null) sub = c.getSubject();
        return sub == null ? null : Long.valueOf(sub.toString());
    }

    public String extractRole(String token) {
        Claims c = parseClaims(token);
        Object role = c.get("role");
        return role == null ? null : role.toString();
    }
}
