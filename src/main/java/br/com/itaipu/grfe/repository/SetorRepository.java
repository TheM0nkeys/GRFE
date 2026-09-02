package br.com.itaipu.grfe.repository;

import br.com.itaipu.grfe.entity.Setor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SetorRepository extends JpaRepository<Setor, Long> {
}
