package br.com.itaipu.grfe.dto.response;


import br.com.itaipu.grfe.client.dtoservicenow.ServiceNowIncidentRaw;

public record ServiceNowIncidentResponse(
        boolean disponivel,
        String sysId,
        String numero,
        String descricaoResumida,
        String descricao,
        String impacto,
        String urgencia,
        String status
) {
    public static ServiceNowIncidentResponse fromRaw(ServiceNowIncidentRaw raw) {
        ServiceNowIncidentRaw.Result r = raw.result();
        return new ServiceNowIncidentResponse(
                true,
                r.sys_id(),
                r.number(),
                r.short_description(),
                r.description(),
                r.impact(),
                r.urgency(),
                r.state()
        );
    }

    public static ServiceNowIncidentResponse indisponivel() {
        return new ServiceNowIncidentResponse(
                false, null, null, null, null, null, null,
                "Integração com o ServiceNow indisponível no momento."
        );
    }
}