const axios = require('axios');

module.exports = {
    selicAtual: async (req, res) => {
        try {
            const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados/ultimos/1?formato=json";
            const response = await axios.get(url);

            const dado = response.data[0];

            return res.json({
                data: dado.data,
                selic: parseFloat(dado.valor)
            });

        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar SELIC." });
        }
    }
};
