# MoneyTrack

Um app simples de controle financeiro pessoal para registrar receitas e despesas, acompanhar o saldo e visualizar onde estão os gastos.

## Funcionalidades

- Cadastro de transações com descrição, valor, tipo, categoria e data.
- Resumo automático do saldo, das receitas e das despesas.
- Histórico com opção de remover transações.
- Gráfico de rosca com a distribuição das despesas por categoria.
- Salvamento dos dados no armazenamento local do navegador.
- Interface adaptável a telas menores.

## Como executar

Não é necessário instalar dependências nem configurar um servidor:

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador.
3. Para carregar o gráfico, mantenha a conexão com a internet disponível: o Chart.js é carregado por CDN.

## Como usar

Preencha a descrição, o valor, o tipo, a categoria e a data da transação. Selecione **Adicionar transação** para incluí-la no histórico. O saldo e os totais são recalculados automaticamente. Use o botão **×** ao lado de uma transação para removê-la.

## Estrutura do projeto

```text
Moneytrack/
├── index.html       # Estrutura da página e campos da interface
├── css/
│   └── style.css    # Aparência e regras de responsividade
└── js/
    └── script.js   # Transações, cálculos, persistência e gráfico
```

## Como o código funciona

### `index.html`

Define as seções da página: cards de resumo, formulário, gráfico e histórico de transações. Os elementos que o JavaScript atualiza possuem identificadores, como `balance`, `transaction-form` e `transactions`. O arquivo também importa o Chart.js e a folha de estilos.

### `js/script.js`

- Recupera as transações salvas em `localStorage` ao iniciar.
- `addTransaction()` lê e adiciona os dados enviados pelo formulário.
- `updateUI()` recalcula os totais, atualiza os cards e redesenha o histórico.
- `updateChart()` agrupa as despesas por categoria e atualiza o gráfico.
- `removeTransaction()` exclui uma transação pelo identificador.
- `formatCurrency()` apresenta os valores no formato de moeda brasileira.

### `css/style.css`

Cuida do tema escuro, dos cards, do formulário e dos estilos gerais. As media queries reorganizam os cards e o formulário em telas menores.

## Armazenamento dos dados

As transações ficam no `localStorage` do navegador. Elas continuam disponíveis no mesmo navegador e dispositivo, mas não são sincronizadas entre dispositivos e não há uma conta ou servidor de dados. Limpar os dados do navegador pode apagar os registros.

## Tecnologias

- HTML
- CSS
- JavaScript
- [Chart.js](https://www.chartjs.org/) via CDN
