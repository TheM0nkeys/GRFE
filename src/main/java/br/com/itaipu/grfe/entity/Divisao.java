package br.com.itaipu.grfe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "divisao")
public class Divisao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

}
