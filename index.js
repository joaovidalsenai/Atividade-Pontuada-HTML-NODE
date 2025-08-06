// 1. Importação das dependências
import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Inicialização do Express
const app = express();
const PORT = 3001;

// 3. Configuração do Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// 4. Definição das Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/imc', (req, res) => {
    // 5. Extração dos dados do corpo da requisição
    const { nome, altura, peso } = req.body;

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
        return res.status(400).json({ erro: 'Altura e peso devem ser números positivos.' });
    }

    // 6. Cálculo do IMC
    const imc = pesoNum / (alturaNum * alturaNum);

    // 7. Classificação do IMC
    let categoria = '';
    if (imc < 16) {
        categoria = 'Baixo peso (grau I)';
    } else if (imc >= 16 && imc <= 16.99) {
        categoria = 'Baixo peso (grau II)';
    } else if (imc >= 17 && imc <= 18.49) {
        categoria = 'Baixo peso (grau III)';
    } else if (imc >= 18.50 && imc <= 24.99) {
        categoria = 'Peso adequado';
    } else if (imc >= 25 && imc <= 29.99) {
        categoria = 'Sobrepeso';
    } else if (imc >= 30 && imc <= 34.99) {
        categoria = 'Obesidade (grau I)';
    } else if (imc >= 35 && imc <= 39.99) {
        categoria = 'Obesidade (grau II)';
    } else { // imc >= 40
        categoria = 'Obesidade (grau III)';
    }

    res.json({
        nome: nome,
        imc: imc.toFixed(2),
        categoria: categoria
    });
});

// 8. Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});