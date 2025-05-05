package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.example.demo.util.JwtUtil;
import com.example.demo.service.CustomUserDetailsService;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        logger.info("======= Starting JWT Filter for request: " + request.getRequestURI() + " =======");
        logger.info("Request method: " + request.getMethod());
        logger.info("getServletPath: " + request.getServletPath());
        String path = request.getServletPath();

        if (path.startsWith("/api/auth")) {
            logger.info("Auth path detected - skipping JWT validation");
            chain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");
        logger.info("Authorization header: " + (authorizationHeader != null ? "present" : "null"));

        String username = null;
        String jwt = null;
        String role = null;
        String userType = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                role = jwtUtil.extractRole(jwt);
                userType = jwtUtil.extractUserType(jwt);
                Date expiration = jwtUtil.extractExpiration(jwt);
                Date now = new Date();
                
                logger.info("JWT Token details:");
                logger.info("Extracted username from token: " + username);
                logger.info("Extracted role from token: " + role);
                logger.info("Extracted userType from token: " + userType);
                logger.info("Token expiration: " + expiration);
                logger.info("Current time: " + now);
                logger.info("Token expired? " + (expiration.before(now)));
                
                if (path.startsWith("/api/volunteer/")) {
                    logger.info("Volunteer endpoint access - role: " + role + ", userType: " + userType);
                    boolean hasVolunteerRole = "volunteer".equalsIgnoreCase(role) || "VOLUNTEER".equals(role);
                    boolean hasVolunteerType = "volunteer".equalsIgnoreCase(userType) || "VOLUNTEER".equals(userType);
                    logger.info("Has volunteer role: " + hasVolunteerRole + ", has volunteer type: " + hasVolunteerType);
                }
            } catch (Exception e) {
                logger.error("Error extracting username from token: " + e.getMessage());
                logger.error("Token validation failed", e);
            }
        } else {
            logger.warn("No authorization header or incorrect format");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                logger.info("Loaded user details: " + userDetails.getUsername());
                logger.info("User authorities: " + userDetails.getAuthorities());
                
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.info("Token validated successfully for user: " + username);
                    
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    userDetails.getAuthorities().forEach(auth -> authorities.add(new SimpleGrantedAuthority(auth.getAuthority())));
                    
                    if (role != null && !role.isEmpty()) {
                        authorities.add(new SimpleGrantedAuthority(role));
                        logger.info("Added role from token as authority: " + role);
                    }
                    
                    if (userType != null && !userType.isEmpty()) {
                        authorities.add(new SimpleGrantedAuthority(userType));
                        logger.info("Added userType from token as authority: " + userType);
                    }
                    
                    var authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Authentication set in SecurityContext with authorities: " + authToken.getAuthorities());
                } else {
                    logger.warn("Token validation failed for user: " + username);
                }
            } catch (Exception e) {
                logger.error("Error during user authentication: " + e.getMessage());
            }
        } else if (username == null) {
            logger.warn("Username is null, cannot authenticate");
        } else {
            logger.info("SecurityContext already has authentication");
        }

        logger.info("======= Continuing filter chain =======");
        chain.doFilter(request, response);
    }

}
