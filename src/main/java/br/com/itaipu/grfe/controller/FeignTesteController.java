package br.com.itaipu.grfe.controller;

import br.com.itaipu.grfe.client.JsonPlaceholderClient;
import br.com.itaipu.grfe.dto.request.PostBodyRequest;
import br.com.itaipu.grfe.dto.response.PostResponse;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teste-feign")
public class FeignTesteController {

    private final JsonPlaceholderClient jsonPlaceholderClient;

    public FeignTesteController(JsonPlaceholderClient jsonPlaceholderClient) {
        this.jsonPlaceholderClient = jsonPlaceholderClient;
    }

    @PostMapping
    public PostResponse criarPost(@RequestBody PostBodyRequest request) {
        return jsonPlaceholderClient.criarPost(request);
    }

    @DeleteMapping("/{id}")
    public void deletarPost(@PathVariable Long id) {
        jsonPlaceholderClient.deletarPost(id);
    }

}