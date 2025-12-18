const db = require('../database/db');

module.exports = {
  resumo: (req, res) => {
    const userId = req.user.id;
    const ano = req.query.ano ? String(req.query.ano) : null; // ano selecionado (opcional)
    const filtroAno = ano ? `AND strftime('%Y', data) = '${ano}'` : '';

    // TOTAL DE RECEITAS
    const entradas = db.prepare(`
      SELECT SUM(valor) as total
      FROM lancamentos
      WHERE usuario_id = ? AND tipo = 'entrada' ${filtroAno}
    `).get(userId).total || 0;

    // TOTAL DE DESPESAS
    const saidas = db.prepare(`
      SELECT SUM(valor) as total
      FROM lancamentos
      WHERE usuario_id = ? AND tipo = 'saida' ${filtroAno}
    `).get(userId).total || 0;

    // SALDO
    const saldo = entradas - saidas;

    // GRÁFICO DE BARRAS (ENTRADAS X SAÍDAS POR MÊS)
    const porMesRaw = db.prepare(`
      SELECT
        printf('%02d', CAST(strftime('%m', data) AS integer)) AS mes_num,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS saidas
      FROM lancamentos
      WHERE usuario_id = ? ${filtroAno}
      GROUP BY mes_num
      ORDER BY mes_num ASC
    `).all(userId);

    const mesesDoAno = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const porMes = mesesDoAno.map(m => {
      const mesData = porMesRaw.find(p => p.mes_num === m);
      return {
        mes: m,
        entradas: mesData ? mesData.entradas : 0,
        saidas: mesData ? mesData.saidas : 0
      };
    });

    // GRÁFICO PIZZA — DESPESAS POR CATEGORIA
    const porCategoria = db.prepare(`
      SELECT 
        c.nome AS categoria,
        SUM(l.valor) AS total
      FROM lancamentos l
      JOIN categorias c ON c.id = l.categoria_id
      WHERE l.usuario_id = ? AND l.tipo = 'saida' ${filtroAno}
      GROUP BY c.nome
      ORDER BY total DESC
    `).all(userId);

    return res.json({
      entradas,
      saidas,
      saldo,
      porMes,
      porCategoria
    });
  },

  anosDisponiveis: (req, res) => {
    const userId = req.user.id;
    const anos = db.prepare(`
      SELECT DISTINCT strftime('%Y', data) AS ano
      FROM lancamentos
      WHERE usuario_id = ?
      ORDER BY ano DESC
    `).all(userId).map(r => parseInt(r.ano, 10));

    res.json(anos);
  }
};
