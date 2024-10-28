const pool = require('../../infrastructure/database/MySQLConnection');

class UsuarioRepository {
  async create(userData) {
    // Validações para garantir que todos os campos necessários estão presentes
    if (
      !userData ||
      !userData.cpf ||
      !userData.nome ||
      !userData.senhaHash ||
      !userData.endereco ||
      !userData.endereco.rua ||
      !userData.endereco.numero ||
      !userData.endereco.bairro ||
      !userData.endereco.cidade ||
      !userData.endereco.estado ||
      !userData.endereco.cep
    ) {
      throw new Error('Dados de usuário incompletos ou inválidos');
    }

    const connection = await pool.getConnection();
    try {
      const sql = `
        INSERT INTO usuarios (
          cpf, nome, senha_hash, data_nascimento,
          endereco_rua, endereco_numero, endereco_complemento,
          endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
          status, created_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `;

      const values = [
        userData.cpf,
        userData.nome,
        userData.senhaHash,
        userData.dataNascimento || null,
        userData.endereco.rua,
        userData.endereco.numero,
        userData.endereco.complemento || null,
        userData.endereco.bairro,
        userData.endereco.cidade,
        userData.endereco.estado,
        userData.endereco.cep,
        userData.status || 'Ativo',
        userData.createdBy || 'system'
      ];

      const [result] = await connection.execute(sql, values);
      return { id: result.insertId, ...userData };
    } catch (error) {
      console.error('Erro ao criar usuário no repositório:', error.message);
      throw new Error('Erro ao criar usuário');
    } finally {
      connection.release();
    }
  }

  async findById(id) {
    const connection = await pool.getConnection();
    try {
      const sql = `SELECT * FROM usuarios WHERE id = ? AND status != 'Removido'`;
      const [rows] = await connection.execute(sql, [id]);

      if (rows.length === 0) {
        return null;
      }

      return this._mapToUser(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar usuário por ID no repositório:', error);
      throw new Error('Erro ao buscar usuário');
    } finally {
      connection.release();
    }
  }

  async update(id, updateData) {
    const connection = await pool.getConnection();
    try {
      const {
        nome,
        dataNascimento,
        endereco = {},  
        updatedBy = 'system',
      } = updateData;
  
      const {
        rua = null,
        numero = null,
        complemento = null,
        bairro = null,
        cidade = null,
        estado = null,
        cep = null,
      } = endereco;
  
      const sql = `
        UPDATE usuarios SET
          nome = ?,
          data_nascimento = ?,
          endereco_rua = ?,
          endereco_numero = ?,
          endereco_complemento = ?,
          endereco_bairro = ?,
          endereco_cidade = ?,
          endereco_estado = ?,
          endereco_cep = ?,
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ? AND status != 'Removido'
      `;
  
      const values = [
        nome,
        dataNascimento,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        updatedBy,
        id,
      ];
  
      const [result] = await connection.execute(sql, values);
  
      if (result.affectedRows === 0) {
        return null;
      }
  
      return await this.findById(id);
    } catch (error) {
      console.error('Erro ao atualizar usuário no repositório:', error);
      throw new Error('Erro ao atualizar usuário');
    } finally {
      connection.release();
    }
  }
  

  async delete(id, deletedBy = 'system') {
    const connection = await pool.getConnection();
    try {
      const sql = `
        UPDATE usuarios SET
          status = 'Removido',
          deleted_at = NOW(),
          deleted_by = ?
        WHERE id = ? AND status != 'Removido'
      `;

      const [result] = await connection.execute(sql, [deletedBy, id]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao deletar usuário no repositório:', error);
      throw new Error('Erro ao deletar usuário');
    } finally {
      connection.release();
    }
  }

  async findByCPF(cpf) {
    const connection = await pool.getConnection();
    try {
      const sql = `SELECT * FROM usuarios WHERE cpf = ? AND status != 'Removido'`;
      const [rows] = await connection.execute(sql, [cpf]);

      if (rows.length === 0) {
        return null;
      }

      return this._mapToUser(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar usuário por CPF no repositório:', error);
      throw new Error('Erro ao buscar usuário');
    } finally {
      connection.release();
    }
  }

  async findAll() {
    const connection = await pool.getConnection();
    try {
      const sql = `SELECT * FROM usuarios WHERE status != 'Removido'`;
      const [rows] = await connection.execute(sql);

      return rows.map((row) => this._mapToUser(row));
    } catch (error) {
      console.error('Erro ao buscar todos os usuários no repositório:', error);
      throw new Error('Erro ao buscar usuários');
    } finally {
      connection.release();
    }
  }

  // Mapeia os dados do banco para o objeto de usuário
  _mapToUser(row) {
    if (!row || typeof row !== 'object') {
      throw new Error('Dados do usuário não fornecidos ou inválidos');
    }
  
    return {
      id: row.id,
      cpf: row.cpf,
      nome: row.nome,
      senhaHash: row.senha_hash,
      dataNascimento: row.data_nascimento,
      endereco: {
        rua: row.endereco_rua,
        numero: row.endereco_numero,
        complemento: row.endereco_complemento || '',
        bairro: row.endereco_bairro,
        cidade: row.endereco_cidade,
        estado: row.endereco_estado,
        cep: row.endereco_cep,
      },
      status: row.status,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      deletedAt: row.deleted_at,
      deletedBy: row.deleted_by,
    };
  }  
  
}

module.exports = UsuarioRepository;
