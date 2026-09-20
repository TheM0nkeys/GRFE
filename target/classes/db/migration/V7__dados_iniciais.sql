-- Divisão
INSERT INTO divisao (id, nome)
SELECT nextval('divisao_seq'), 'Divisão de Tecnologia'
    WHERE NOT EXISTS (
    SELECT 1
    FROM divisao
    WHERE nome = 'Divisão de Tecnologia'
);


-- Departamento
INSERT INTO departamento (id, nome, divisao_id)
SELECT
    nextval('departamento_seq'),
    'Departamento de Sistemas',
    d.id
FROM divisao d
WHERE d.nome = 'Divisão de Tecnologia'
  AND NOT EXISTS (
    SELECT 1
    FROM departamento dep
    WHERE dep.nome = 'Departamento de Sistemas'
);


-- Especialidade
INSERT INTO especialidades (
    id,
    nome,
    descricao,
    divisao_id,
    departamento_id
)
SELECT
    nextval('especialidades_seq'),
    'Desenvolvimento de Sistemas',
    'Especialidade responsável por desenvolvimento e manutenção de sistemas',
    d.id,
    dep.id
FROM divisao d
         JOIN departamento dep
              ON dep.divisao_id = d.id
WHERE d.nome = 'Divisão de Tecnologia'
  AND dep.nome = 'Departamento de Sistemas'
  AND NOT EXISTS (
    SELECT 1
    FROM especialidades e
    WHERE e.nome = 'Desenvolvimento de Sistemas'
);


-- Felipe
INSERT INTO funcionario (
    id,
    nome,
    matricula,
    email
)
SELECT
    nextval('funcionario_seq'),
    'Felipe Oliveira',
    '100001',
    'felipe@itaipu.com.br'
    WHERE NOT EXISTS (
    SELECT 1
    FROM funcionario
    WHERE matricula = '100001'
);


-- Pedro
INSERT INTO funcionario (
    id,
    nome,
    matricula,
    email
)
SELECT
    nextval('funcionario_seq'),
    'Pedro Moraes',
    '100002',
    'pedro@itaipu.com.br'
    WHERE NOT EXISTS (
    SELECT 1
    FROM funcionario
    WHERE matricula = '100002'
);


-- Vincular Felipe à especialidade
INSERT INTO funcionario_especialidades (
    funcionario_id,
    especialidade_id
)
SELECT
    f.id,
    e.id
FROM funcionario f
         JOIN especialidades e
              ON e.nome = 'Desenvolvimento de Sistemas'
WHERE f.matricula = '100001'
  AND NOT EXISTS (
    SELECT 1
    FROM funcionario_especialidades fe
    WHERE fe.funcionario_id = f.id
      AND fe.especialidade_id = e.id
);


-- Vincular Pedro à especialidade
INSERT INTO funcionario_especialidades (
    funcionario_id,
    especialidade_id
)
SELECT
    f.id,
    e.id
FROM funcionario f
         JOIN especialidades e
              ON e.nome = 'Desenvolvimento de Sistemas'
WHERE f.matricula = '100002'
  AND NOT EXISTS (
    SELECT 1
    FROM funcionario_especialidades fe
    WHERE fe.funcionario_id = f.id
      AND fe.especialidade_id = e.id
);