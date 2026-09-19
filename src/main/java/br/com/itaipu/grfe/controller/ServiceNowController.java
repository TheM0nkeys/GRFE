package br.com.itaipu.grfe.controller;

import br.com.itaipu.grfe.dto.request.ServiceNowIncidentRequest;
import br.com.itaipu.grfe.dto.response.ServiceNowIncidentResponse;
import br.com.itaipu.grfe.service.ServiceNowService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Integração ServiceNow", description = "Criação e atualização de incidentes complementares no ServiceNow (CA14/CA15)")
@RestController
@RequestMapping("/integracao/servicenow")
public class ServiceNowController {

    private final ServiceNowService serviceNowService;

    public ServiceNowController(ServiceNowService serviceNowService) {
        this.serviceNowService = serviceNowService;
    }

    @PostMapping("/incidentes")
    public ResponseEntity<ServiceNowIncidentResponse> criarIncidente(
            @RequestBody @Valid ServiceNowIncidentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(serviceNowService.criarIncidente(request));
    }

    @PatchMapping("/incidentes/{sysId}")
    public ResponseEntity<ServiceNowIncidentResponse> atualizarIncidente(
            @PathVariable String sysId,
            @RequestBody @Valid ServiceNowIncidentRequest request) {

        return ResponseEntity.ok(
                serviceNowService.atualizarIncidente(sysId, request)
        );
    }
}