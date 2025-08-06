// 1. Importação das dependências (COM A CORREÇÃO)
import express from 'express';
import bodyParser from 'body-parser'; // CORREÇÃO: Importe o 'body-parser' como um módulo padrão
import path, { dirname } from 'path';  // ADIÇÃO: Importa 'path' e 'dirname'
import { fileURLToPath } from 'url';    // ADIÇÃO: Importa 'fileURLToPath' para resolver o __dirname

// ADIÇÃO: Bloco de código para definir __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Inicialização do Express
const app = express();
const PORT = 3001; // Você mudou a porta, mantive 3001

// 3. Configuração do Middleware (COM A CORREÇÃO)
// CORREÇÃO: Use a variável bodyParser importada
app.use(bodyParser.urlencoded({ extended: true }));

// 4. Definição das Rotas

/**
 * Rota GET /
 * Envia o arquivo form.html para o cliente quando a raiz do site é acessada.
 */
app.get('/', (req, res) => {
    // Agora o 'path.join' (ou só 'join' como você usou) funcionará pois __dirname está definido
    res.sendFile(path.join(__dirname, 'form.html'));
});

/**
 * Rota POST /imc
 * Processa os dados enviados pelo formulário.
 */
app.post('/imc', (req, res) => {
    // O restante do seu código está perfeito e não precisa de alterações.
    const { nome, altura, peso } = req.body;

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
        return res.status(400).send('<h1>Erro</h1><p>Altura e peso devem ser números positivos.</p><a href="/">Voltar</a>');
    }

    const imc = pesoNum / (alturaNum * alturaNum);

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
    } else {
        categoria = 'Obesidade (grau III)';
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <title>Resultado do IMC</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .container { background-color: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; }
                h1 { color: #007bff; }
                p { font-size: 1.2rem; }
                a { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Resultado do IMC</h1>
                <p>Olá, <strong>${nome}</strong>!</p>
                <p>Seu IMC é <strong>${imc.toFixed(2)}</strong>.</p>
                <p>Sua classificação é: <strong>${categoria}</strong>.</p>
                <a href="/">Calcular Novamente</a>
            </div>
        </body>
        </html>
    `);
});

// 9. Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});