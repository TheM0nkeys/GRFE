package br.com.itaipu.grfe.dto.response;

public record PostResponse(
        Long id,
        String title,
        String body,
        Long userId
) {
}