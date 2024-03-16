package in.aprise.finance.shared.config;

import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Service
public class JWTService {

    private Key getSigningKey() {
        String SECRET_KEY = "9c8edeaed2af9a1afe2d0d0be9e95c8ee07e9aae85bfcd86660c6ee54c393f8b";
        byte[] secretBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(secretBytes);
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new ApriseException(GlobalError.AUTHENTICATION_ERROR, e.getMessage());
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date getExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean isTokenExpired(String token) {
        return getExpirationDate(token).before(new Date());
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .signWith(getSigningKey())
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 30)) // 30 days
                .addClaims(extraClaims)
                .compact();
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public Boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return Objects.equals(email, userDetails.getUsername()) && !isTokenExpired(token);
    }

}
