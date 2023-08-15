const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex')(require('./knexfile').development);

const app = express();
const PORT = 3000;

app.use(express.json());

// TODO: Adicione aqui as suas rotas

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para criar um usuário
app.post('/users', async (req, res) => {
    try {
      const { nome_do_usuario, email_do_usuario, senha_do_usuario, avatar_do_usuario } = req.body;
  
      // Verifique se o e-mail já está em uso
      const userExists = await knex('users').where('email_do_usuario', email_do_usuario).first();
      if (userExists) {
        return res.status(400).json({ error: 'E-mail já está em uso' });
      }
  
      // Criptografe a senha
      const hashedPassword = await bcrypt.hash(senha_do_usuario, 10);
  
      // Insira o usuário no banco de dados
      const userId = await knex('users').insert({
        nome_do_usuario,
        email_do_usuario,
        senha_do_usuario: hashedPassword,
        avatar_do_usuario
      });
  
      res.status(201).json({ id: userId[0] });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  });
  
  // TODO: Adicione outras rotas aqui
  app.post('/movie_notes', async (req, res) => {
    try {
        const { titulo_do_filme, descricao_do_filme, nota, id_do_usuario } = req.body;

        // Certifique-se de que o usuário existe
        const userExists = await knex('users').where('id', id_do_usuario).first();
        if (!userExists) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        // Insira a nota do filme no banco de dados
        const movieNoteId = await knex('movie_notes').insert({
            titulo_do_filme,
            descricao_do_filme,
            nota,
            id_do_usuario
        });

        res.status(201).json({ id: movieNoteId[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar anotação do filme' });
    }
});

//tags
app.post('/movie_tags', async (req, res) => {
    try {
        const { nome_da_tag, id_da_anotacao, id_do_usuario } = req.body;

        // Certifique-se de que a anotação do filme e o usuário existam
        const movieNoteExists = await knex('movie_notes').where('id', id_da_anotacao).first();
        const userExists = await knex('users').where('id', id_do_usuario).first();

        if (!movieNoteExists || !userExists) {
            return res.status(400).json({ error: 'Anotação do filme ou usuário não encontrados' });
        }

        // Insira a tag do filme no banco de dados
        const movieTagId = await knex('movie_tags').insert({
            nome_da_tag,
            id_da_anotacao,
            id_do_usuario
        });

        res.status(201).json({ id: movieTagId[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar tag do filme' });
    }
});

//new password
app.put('/users/password', async (req, res) => {
    try {
        const { id_do_usuario, senha_antiga, nova_senha } = req.body;

        const user = await knex('users').where('id', id_do_usuario).first();

        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        // Verifique a senha antiga
        const match = await bcrypt.compare(senha_antiga, user.senha_do_usuario);

        if (!match) {
            return res.status(400).json({ error: 'Senha antiga incorreta' });
        }

        // Criptografe a nova senha
        const hashedPassword = await bcrypt.hash(nova_senha, 10);

        // Atualize a senha no banco de dados
        await knex('users').where('id', id_do_usuario).update({
            senha_do_usuario: hashedPassword
        });

        res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar senha' });
    }
});

//delete film
app.delete('/movie_notes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRows = await knex('movie_notes').where('id', id).delete();

        if (deletedRows === 0) {
            return res.status(404).json({ error: 'Anotação do filme não encontrada' });
        }

        res.status(200).json({ message: 'Anotação do filme e suas tags foram deletadas com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar anotação do filme' });
    }
});
