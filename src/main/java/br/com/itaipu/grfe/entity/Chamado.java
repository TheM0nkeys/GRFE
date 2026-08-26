package br.com.itaipu.grfe.entity;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Chamado {

    private String id;
    private String nome;
    private String descricao;
    private Integer chamdostotal;

}
