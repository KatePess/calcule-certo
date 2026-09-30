import { consultar } from '../db.js';

// Dados da empresa (migracoes/007_empresas.sql). O CNPJ vem de usuarios.
export const empresaRepositorio = {
  // Sempre devolve uma linha para uma conta existente: sem empresa salva,
  // os campos da empresa vem nulos.
  async buscar(usuarioId) {
    const { rows } = await consultar(
      `SELECT u.cnpj, e.razao_social, e.nome_fantasia, e.inscricao_estadual,
              e.email_corporativo, e.telefone, e.funcionarios, e.porte,
              e.ramo_atividade, e.cidade, e.uf, e.atualizado_em
         FROM usuarios u
         LEFT JOIN empresas e ON e.usuario_id = u.id
        WHERE u.id = $1`,
      [usuarioId],
    );
    return rows[0] ?? null;
  },

  // Cria na primeira vez e atualiza nas seguintes.
  async salvar(usuarioId, empresa, cliente) {
    await consultar(
      `INSERT INTO empresas (usuario_id, razao_social, nome_fantasia, inscricao_estadual,
                             email_corporativo, telefone, funcionarios, porte,
                             ramo_atividade, cidade, uf)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (usuario_id) DO UPDATE SET
         razao_social = EXCLUDED.razao_social,
         nome_fantasia = EXCLUDED.nome_fantasia,
         inscricao_estadual = EXCLUDED.inscricao_estadual,
         email_corporativo = EXCLUDED.email_corporativo,
         telefone = EXCLUDED.telefone,
         funcionarios = EXCLUDED.funcionarios,
         porte = EXCLUDED.porte,
         ramo_atividade = EXCLUDED.ramo_atividade,
         cidade = EXCLUDED.cidade,
         uf = EXCLUDED.uf,
         atualizado_em = NOW()`,
      [
        usuarioId,
        empresa.razaoSocial,
        empresa.nomeFantasia,
        empresa.inscricaoEstadual,
        empresa.emailCorporativo,
        empresa.telefone,
        empresa.funcionarios,
        empresa.porte,
        empresa.ramoAtividade,
        empresa.cidade,
        empresa.uf,
      ],
      cliente,
    );
  },
};
