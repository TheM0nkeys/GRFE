package br.com.itaipu.grfe.dto.request;

import br.com.itaipu.grfe.client.dtoservicenow.ServiceNowIncidentPayload;
import jakarta.validation.constraints.NotBlank;

public record ServiceNowIncidentRequest(
        @NotBlank(message = "A descrição resumida é obrigatória") String descricaoResumida,
        @NotBlank(message = "A descrição é obrigatória") String descricao,
        @NotBlank(message = "O impacto é obrigatório") String impacto,
        @NotBlank(message = "A urgência é obrigatória") String urgencia
) {
    public ServiceNowIncidentPayload toPayload() {
        return new ServiceNowIncidentPayload(descricaoResumida, descricao, impacto, urgencia);
    }
}