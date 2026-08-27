package br.com.itaipu.grfe.repository;

import br.com.itaipu.grfe.entity.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
}
