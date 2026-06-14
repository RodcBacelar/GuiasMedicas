CREATE TYPE tipo_usuario AS ENUM ('medico', 'paciente', 'unidade');
CREATE TYPE tipo_sexo AS ENUM ('masculino', 'feminino', 'outro');
CREATE TYPE tipo_status AS ENUM ('pendente', 'em_analise', 'aprovado', 'negado');

CREATE TABLE usuario 
(
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo tipo_usuario NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE paciente 
(
  id_usuario INT PRIMARY KEY REFERENCES usuario(id),
  nascimento DATE NOT NULL,
  sexo tipo_sexo NOT NULL
);

CREATE TABLE medico 
(
  id_usuario INT PRIMARY KEY REFERENCES usuario(id),
  nascimento DATE NOT NULL,
  sexo tipo_sexo NOT NULL,
  residencia VARCHAR(100) NOT NULL,
  especialidade VARCHAR(50) NOT NULL,
  cargo VARCHAR(50) NOT NULL
);

CREATE TABLE unidade
(
  id_usuario INT PRIMARY KEY REFERENCES usuario(id),
  rua VARCHAR(100) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  bairro VARCHAR(50) NOT NULL,
  cidade VARCHAR(50) NOT NULL,
  estado CHAR(2) NOT NULL,
  cep CHAR(8) NOT NULL
);

CREATE TABLE guia
(
  id SERIAL PRIMARY KEY,
  id_medico INT NOT NULL REFERENCES medico(id_usuario),
  id_paciente INT NOT NULL REFERENCES paciente(id_usuario),
  id_unidade INT NOT NULL REFERENCES unidade(id_usuario),
  status tipo_status NOT NULL DEFAULT 'pendente',
  prioridade INT NOT NULL,
  numero_consultas INT NOT NULL,
  tempo_doenca VARCHAR(200) NOT NULL,
  quadro_clinico VARCHAR(200) NOT NULL,
  hipotese_diagnostico VARCHAR(200) NOT NULL,
  cid_10 VARCHAR(10) NOT NULL,
  medicacao VARCHAR(200) NOT NULL,
  tratamento_evolucao VARCHAR(200) NOT NULL,
  motivo_encaminhamento VARCHAR(200) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exame
(
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  descricao VARCHAR(200) NOT NULL
);

CREATE TABLE guia_exame
(
  id_guia INT NOT NULL REFERENCES guia(id),
  id_exame INT NOT NULL REFERENCES exame(id),
  PRIMARY KEY (id_guia, id_exame)
);

INSERT INTO exame (nome, descricao) VALUES
  ('Hemograma completo',         'Avaliação quantitativa e qualitativa das células sanguíneas'),
  ('Glicemia em jejum',          'Dosagem de glicose no sangue após período de jejum'),
  ('Colesterol total e frações', 'Avaliação do perfil lipídico: LDL, HDL e triglicerídeos'),
  ('Creatinina sérica',          'Avaliação da função renal'),
  ('Ureia',                      'Avaliação complementar da função renal'),
  ('TGO / TGP',                  'Avaliação da função hepática (transaminases)'),
  ('TSH',                        'Avaliação da função da tireoide'),
  ('HbA1c',                      'Hemoglobina glicada – controle glicêmico de longo prazo'),
  ('Urina tipo I',                'Análise físico-química e microscópica da urina'),
  ('PSA total',                   'Antígeno prostático específico'),
  ('Raio-X de tórax',            'Imagem radiológica do tórax em PA e perfil'),
  ('Eletrocardiograma',          'Avaliação da atividade elétrica do coração'),
  ('Ecocardiograma',             'Ultrassonografia do coração'),
  ('Ecografia abdominal',        'Ultrassonografia dos órgãos abdominais'),
  ('Tomografia de tórax',        'Imagem tomográfica computadorizada do tórax'),
  ('Ressonância magnética',      'Imagem por ressonância magnética nuclear');