package br.com.itaipu.grfe.client;


import br.com.itaipu.grfe.client.dtoservicenow.ServiceNowIncidentPayload;
import br.com.itaipu.grfe.client.dtoservicenow.ServiceNowIncidentRaw;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "serviceNowClient",
        url = "${servicenow.url}"
)
public interface ServiceNowClient {

    @PostMapping("/api/now/table/incident")
    ServiceNowIncidentRaw criarIncidente(
            @RequestBody ServiceNowIncidentPayload payload
    );

    @PatchMapping("/api/now/table/incident/{sysId}")
    ServiceNowIncidentRaw atualizarIncidente(
            @PathVariable("sysId") String sysId,
            @RequestBody ServiceNowIncidentPayload payload
    );
}