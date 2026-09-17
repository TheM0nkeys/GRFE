package br.com.itaipu.grfe.client;

import br.com.itaipu.grfe.dto.request.PostBodyRequest;
import br.com.itaipu.grfe.dto.response.PostResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "jsonPlaceholderClient",
        url = "https://jsonplaceholder.typicode.com"
)
public interface JsonPlaceholderClient {

    @PostMapping("/posts")
    PostResponse criarPost(
            @RequestBody PostBodyRequest bodyRequest
    );

    @DeleteMapping("/posts/{id}")
    void deletarPost(
            @PathVariable("id") Long id
    );

}