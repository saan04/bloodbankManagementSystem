package com.bloodbank.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GatewayServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("donor_service_route", r -> r
                        .path("/api/donors/**")
                        .uri("http://localhost:8081"))
                .route("inventory_service_route", r -> r
                        .path("/api/inventory/**")
                        .uri("http://localhost:8082"))
                .route("request_service_route", r -> r
                        .path("/api/requests/**")
                        .uri("http://localhost:8083"))
                .build();
    }
}
