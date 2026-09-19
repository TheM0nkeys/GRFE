package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.client.ServiceNowClient;
import br.com.itaipu.grfe.client.dtoservicenow.ServiceNowIncidentRaw;
import br.com.itaipu.grfe.dto.request.ServiceNowIncidentRequest;
import br.com.itaipu.grfe.dto.response.ServiceNowIncidentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ServiceNowService {

    private static final Logger log = LoggerFactory.getLogger(ServiceNowService.class);

    private final ServiceNowClient serviceNowClient;

    public ServiceNowService(ServiceNowClient serviceNowClient) {
        this.serviceNowClient = serviceNowClient;
    }

    public ServiceNowIncidentResponse criarIncidente(ServiceNowIncidentRequest request) {
        try {
            ServiceNowIncidentRaw raw = serviceNowClient.criarIncidente(request.toPayload());
            return ServiceNowIncidentResponse.fromRaw(raw);
        } catch (Exception ex) {
            log.warn("Falha ao criar incidente no ServiceNow: {}", ex.getMessage());
            return ServiceNowIncidentResponse.indisponivel();
        }
    }

    public ServiceNowIncidentResponse atualizarIncidente(String sysId, ServiceNowIncidentRequest request) {
        try {
            ServiceNowIncidentRaw raw = serviceNowClient.atualizarIncidente(sysId, request.toPayload());
            return ServiceNowIncidentResponse.fromRaw(raw);
        } catch (Exception ex) {
            log.warn("Falha ao atualizar incidente no ServiceNow: sysId={}, motivo={}", sysId, ex.getMessage());
            return ServiceNowIncidentResponse.indisponivel();
        }
    }
}