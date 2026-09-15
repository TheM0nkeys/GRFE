package br.com.itaipu.grfe.dto.request;

public record PostBodyRequest(
        String title,
        String body,
        Long userId
) {
}