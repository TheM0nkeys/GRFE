-- Dados operacionais iniciais para demonstração do sistema

-- ESCALA
INSERT INTO escala (
    id,
    data_hora_inicio,
    data_hora_fim,
    especialidade_id,
    funcionario_id
)
SELECT
    nextval('escala_seq'),
    TIMESTAMP '2026-09-16 18:00:00',
    TIMESTAMP '2026-09-17 06:00:00',
    e.id,
    f.id
FROM especialidades e
         JOIN funcionario f
              ON f.matricula = '100001'
WHERE e.nome = 'Desenvolvimento de Sistemas'
  AND NOT EXISTS (
    SELECT 1
    FROM escala esc
    WHERE esc.especialidade_id = e.id
      AND esc.funcionario_id = f.id
      AND esc.data_hora_inicio = TIMESTAMP '2026-09-16 18:00:00'
);


-- CHAMADO
INSERT INTO chamado (
    id,
    data_hora_acionamento,
    especialidade_id,
    plantonista_id,
    usuario_responsavel_id,
    motivo,
    numero_incidente,
    status
)
SELECT
    nextval('chamado_seq'),
    TIMESTAMP '2026-09-16 20:00:00',
    e.id,
    plantonista.id,
    responsavel.id,
    'Falha identificada em sistema durante período de sobreaviso',
    'INC-001',
    'ABERTO'
FROM especialidades e
         JOIN funcionario plantonista
              ON plantonista.matricula = '100001'
         JOIN funcionario responsavel
              ON responsavel.matricula = '100002'
WHERE e.nome = 'Desenvolvimento de Sistemas'
  AND NOT EXISTS (
    SELECT 1
    FROM chamado c
    WHERE c.numero_incidente = 'INC-001'
);


-- HISTÓRICO
INSERT INTO historico_acionamento (
    id,
    data_hora,
    autor_id,
    comentario,
    chamado_id
)
SELECT
    nextval('historico_acionamento_seq'),
    TIMESTAMP '2026-09-16 20:05:00',
    f.id,
    'Chamado aberto e encaminhado para o plantonista.',
    c.id
FROM chamado c
         JOIN funcionario f
              ON f.matricula = '100002'
WHERE c.numero_incidente = 'INC-001'
  AND NOT EXISTS (
    SELECT 1
    FROM historico_acionamento h
    WHERE h.chamado_id = c.id
      AND h.comentario =
          'Chamado aberto e encaminhado para o plantonista.'
);