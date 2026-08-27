package br.com.itaipu.grfe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "equipe")
public class Equipe {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column (nullable = false)
    private String nome;

    @ManyToMany
    @JoinTable(
            name = "equipe_setores",
            joinColumns = @JoinColumn(name = "equipe_id"),
            inverseJoinColumns = @JoinColumn(name = "setor_id")
    )

    private Set<Setores> setores = new HashSet<>();

    @OneToMany(mappedBy = "equipe")
    private Set<Escala> escalas = new HashSet<>();

    @OneToMany(mappedBy = "equipe")
    private Set<Chamado> chamados = new HashSet<>();

}
