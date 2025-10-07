package com.somdelie_pos.somdelie_pos.configuration;

import com.somdelie_pos.somdelie_pos.modal.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Unified JWT provider that:
 *  - Generates a token containing: sub (userId), email, role, storeId, branchId, authorities
 *  - Uses modern jjwt parsing API first (parser().verifyWith().build().parseSignedClaims)
 *    and falls back to legacy builder styles if the method set is different.
 *  - Provides helper extraction and validation methods.
 */
@Service
public class JwtProvider {

    @Value("${app.jwt.secret:dev-secret-change-me-please-32-bytes-min}")
    private String secret;

    @Value("${app.jwt.expiration-seconds:86400}") // default 24h
    private long expirationSeconds;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate token from Spring Authentication and optional domain User (for store/branch/role ids)
     */
    public String generateToken(Authentication authentication, User user) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String authoritiesCsv = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationSeconds);

        Map<String,Object> claims = new HashMap<>();
        // Standard subject
        if (user != null && user.getId() != null) {
            claims.put("sub", user.getId().toString());
        }
        // Business claims
        claims.put("email", authentication.getName());
        claims.put("authorities", authoritiesCsv);
        if (user != null && user.getRole() != null) {
            claims.put("role", user.getRole().name());
        }
        if (user != null && user.getStore() != null) {
            claims.put("storeId", String.valueOf(user.getStore().getId()));
        }
        if (user != null && user.getBranch() != null) {
            claims.put("branchId", String.valueOf(user.getBranch().getId()));
        }

        // Use modern fluent builder (claims(...)/issuedAt(...)/expiration(...))
        return Jwts.builder()
                .claims(claims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                // For widest compatibility specify algorithm explicitly (older versions may require it)
                .signWith(key(), Jwts.SIG.HS256) // If this line fails, fallback: .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    /** Simple overload when you only have Authentication */
    public String generateToken(Authentication authentication) {
        return generateToken(authentication, null);
    }

    // ---------------- Parsing Helpers ----------------

    private Claims parseClaims(String token) {
        if (token == null || token.isBlank()) throw new JwtException("Token is blank");
        String raw = stripBearer(token);
        Key k = key();
        // Newer jjwt style: parser() returns builder; we always build() then parseSignedClaims.
        // First try verifyWith (preferred); if not available, fall back to setSigningKey + build + parseSignedClaims.
        try {
            return Jwts.parser()
                    .verifyWith(k)
                    .build()
                    .parseSignedClaims(raw)
                    .getPayload();
        } catch (Throwable first) {
            try {
                return Jwts.parser()
                        .setSigningKey(k)
                        .build()
                        .parseSignedClaims(raw)
                        .getPayload();
            } catch (Throwable second) {
                throw new JwtException("Unable to parse JWT", second);
            }
        }
    }

    public boolean validate(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getEmail(String token) {
        return optString(parseClaims(token), "email");
    }

    /**
     * Backward-compatible alias for older code that still calls getEmailFromToken(token).
     */
    public String getEmailFromToken(String token) {
        return getEmail(token);
    }






    public String getRole(String token) { return optString(parseClaims(token), "role"); }

    public Long getUserId(String token) {
        Claims c = parseClaims(token);
        Object sub = c.get("sub");
        if (sub == null) sub = c.getSubject(); // fallback if some builder added subject differently
        return sub == null ? null : Long.valueOf(sub.toString());
    }

    public Long getStoreId(String token) {
        String v = optString(parseClaims(token), "storeId");
        return v == null ? null : Long.valueOf(v);
    }

    public Long getBranchId(String token) {
        String v = optString(parseClaims(token), "branchId");
        return v == null ? null : Long.valueOf(v);
    }

    public Set<String> getAuthorities(String token) {
        String csv = optString(parseClaims(token), "authorities");
        if (csv == null || csv.isBlank()) return Collections.emptySet();
        return Arrays.stream(csv.split(",")).filter(s -> !s.isBlank()).collect(Collectors.toSet());
    }

    // ---------------- Internal utils -----------------

    private String optString(Claims claims, String key) {
        Object v = claims.get(key);
        return v == null ? null : v.toString();
    }

    private String stripBearer(String token) {
        if (token.startsWith("Bearer ")) return token.substring(7);
        return token;
    }
}
