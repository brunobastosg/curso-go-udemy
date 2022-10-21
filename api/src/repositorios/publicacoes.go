package repositorios

import (
	"api/src/modelos"
	"database/sql"
)

// Publicacoes representa um repositório de publicações
type Publicacoes struct {
	db *sql.DB
}

// NovoRepositorioDePublicacoes cria um repositório de usuários
func NovoRepositorioDePublicacoes(db *sql.DB) *Publicacoes {
	return &Publicacoes{db}
}

// Criar insere uma publicação no banco de dados
func (repositorio Publicacoes) Criar(publicacao modelos.Publicacao) (uint64, error) {
	statement, erro := repositorio.db.Prepare(
		"INSERT INTO publicacoes (titulo, conteudo, autor_id) VALUES (?, ?, ?)",
	)
	if erro != nil {
		return 0, erro
	}
	defer statement.Close()

	resultado, erro := statement.Exec(publicacao.Titulo, publicacao.Conteudo, publicacao.AutorID)
	if erro != nil {
		return 0, erro
	}

	ultimoIdInserido, erro := resultado.LastInsertId()
	if erro != nil {
		return 0, erro
	}

	return uint64(ultimoIdInserido), nil
}

// BuscarPorID traz uma publicação do banco de dados
func (repositorio Publicacoes) BuscarPorID(ID uint64) (modelos.Publicacao, error) {
	linha, erro := repositorio.db.Query(`
		SELECT
			p.id, p.titulo, p.conteudo, p.autor_id, u.nick, p.curtidas, p.criada_em
		FROM
			publicacoes p
		INNER JOIN
			usuarios u
		ON
			u.id = p.autor_id
		WHERE
			p.id = ?
		`,
		ID,
	)
	if erro != nil {
		return modelos.Publicacao{}, erro
	}
	defer linha.Close()

	var publicacao modelos.Publicacao

	if linha.Next() {
		if erro = linha.Scan(
			&publicacao.ID,
			&publicacao.Titulo,
			&publicacao.Conteudo,
			&publicacao.AutorID,
			&publicacao.AutorNick,
			&publicacao.Curtidas,
			&publicacao.CriadaEm,
		); erro != nil {
			return modelos.Publicacao{}, erro
		}
	}

	return publicacao, nil
}

// Buscar traz as publicações dos usuários seguidos e também do próprio usuário que fez a requisição
func (repositorio Publicacoes) Buscar(ID uint64) ([]modelos.Publicacao, error) {
	linhas, erro := repositorio.db.Query(`
		SELECT DISTINCT
			p.id, p.titulo, p.conteudo, p.autor_id, u.nick, p.curtidas, p.criada_em
		FROM
			publicacoes p
		INNER JOIN
			usuarios u
		ON
			u.id = p.autor_id
		INNER JOIN
			seguidores s
		ON
			s.usuario_id = p.autor_id
		WHERE
			u.id = ?
		OR
			s.seguidor_id = ?
		ORDER BY
			p.criada_em DESC
		`,
		ID,
		ID,
	)
	if erro != nil {
		return nil, erro
	}
	defer linhas.Close()

	var publicacoes []modelos.Publicacao

	for linhas.Next() {
		var publicacao modelos.Publicacao

		if erro = linhas.Scan(
			&publicacao.ID,
			&publicacao.Titulo,
			&publicacao.Conteudo,
			&publicacao.AutorID,
			&publicacao.AutorNick,
			&publicacao.Curtidas,
			&publicacao.CriadaEm,
		); erro != nil {
			return nil, erro
		}

		publicacoes = append(publicacoes, publicacao)
	}

	return publicacoes, nil
}

// Atualizar altera os dados de uma publicação no banco de dados
func (repositorio Publicacoes) Atualizar(ID uint64, publicacao modelos.Publicacao) error {
	statement, erro := repositorio.db.Prepare(
		"UPDATE publicacoes SET titulo = ?, conteudo = ? WHERE id = ?",
	)
	if erro != nil {
		return erro
	}
	defer statement.Close()

	if _, erro = statement.Exec(publicacao.Titulo, publicacao.Conteudo, ID); erro != nil {
		return erro
	}

	return nil
}

// Deletar remove uma publicação do banco de dados
func (repositorio Publicacoes) Deletar(ID uint64) error {
	statement, erro := repositorio.db.Prepare(
		"DELETE FROM publicacoes WHERE id = ?",
	)
	if erro != nil {
		return erro
	}
	defer statement.Close()

	if _, erro = statement.Exec(ID); erro != nil {
		return erro
	}

	return nil
}

// BuscarPorUsuario traz todas as publicações de um usuário específico
func (repositorio Publicacoes) BuscarPorUsuario(usuarioID uint64) ([]modelos.Publicacao, error) {
	linhas, erro := repositorio.db.Query(`
		SELECT
			p.id, p.titulo, p.conteudo, p.autor_id, u.nick, p.curtidas, p.criada_em
		FROM
			publicacoes p
		INNER JOIN
			usuarios u
		ON
			u.id = p.autor_id
		WHERE
			p.autor_id = ?
		`,
		usuarioID,
	)
	if erro != nil {
		return nil, erro
	}
	defer linhas.Close()

	var publicacoes []modelos.Publicacao

	for linhas.Next() {
		var publicacao modelos.Publicacao

		if erro = linhas.Scan(
			&publicacao.ID,
			&publicacao.Titulo,
			&publicacao.Conteudo,
			&publicacao.AutorID,
			&publicacao.AutorNick,
			&publicacao.Curtidas,
			&publicacao.CriadaEm,
		); erro != nil {
			return nil, erro
		}

		publicacoes = append(publicacoes, publicacao)
	}

	return publicacoes, nil
}

// Curtir adiciona uma curtida na publicação
func (repositorio Publicacoes) Curtir(ID uint64) error {
	statement, erro := repositorio.db.Prepare(
		"UPDATE publicacoes SET curtidas = curtidas + 1 WHERE id = ?",
	)
	if erro != nil {
		return erro
	}
	defer statement.Close()

	if _, erro = statement.Exec(ID); erro != nil {
		return erro
	}

	return nil
}

// Descurtir subtrai uma curtida da publicação
func (repositorio Publicacoes) Descurtir(ID uint64) error {
	statement, erro := repositorio.db.Prepare(`
		UPDATE
			publicacoes
		SET
			curtidas =
			CASE
				WHEN
					curtidas > 0
				THEN
					curtidas - 1
				ELSE
					0
			END
		WHERE id = ?
		`,
	)
	if erro != nil {
		return erro
	}
	defer statement.Close()

	if _, erro = statement.Exec(ID); erro != nil {
		return erro
	}

	return nil
}
