// Selecionando os elementos do DOM
const transactionForm = document.getElementById('transaction-form');
const balanceDisplay = document.getElementById('balance');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');
const transactionsList = document.getElementById('transactions');

// Recuperando transações salvas no LocalStorage (ou iniciando um array vazio)
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Variável global para armazenar a instância do gráfico
let expenseChart = null;

// Função para formatar valores em Reais (R$)
function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para atualizar os cards, a lista e o gráfico
function updateUI() {
    transactionsList.innerHTML = '';

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {
        const amount = Number(item.amount);
        
        if (item.type === 'income') {
            income += amount;
        } else {
            expense += amount;
        }

        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.padding = '12px';
        li.style.marginBottom = '10px';
        li.style.borderRadius = '8px';
        li.style.backgroundColor = '#111827';
        li.style.borderLeft = item.type === 'income' ? '4px solid #10b981' : '4px solid #f87171';

        li.innerHTML = `
            <div>
                <strong style="color: white; display: block; font-size: 15px;">${item.description}</strong>
                <span style="color: #9ca3af; font-size: 12px;">${item.category} • ${item.date}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="color: ${item.type === 'income' ? '#34d399' : '#f87171'}; font-weight: bold;">
                    ${item.type === 'income' ? '+ ' : '- '}${formatCurrency(item.amount)}
                </span>
                <button onclick="removeTransaction(${item.id})" style="background: transparent; border: none; color: #9ca3af; cursor: pointer; font-size: 16px;">&times;</button>
            </div>
        `;

        transactionsList.appendChild(li);
    });

    const balance = income - expense;

    balanceDisplay.textContent = formatCurrency(balance);
    totalIncomeDisplay.textContent = formatCurrency(income);
    totalExpenseDisplay.textContent = formatCurrency(expense);

    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Atualiza o gráfico de despesas
    updateChart();
}

// Função para gerar/atualizar o gráfico de rosca
function updateChart() {
    // Filtrar apenas as despesas
    const expenses = transactions.filter(item => item.type === 'expense');

    // Agrupar valores por categoria
    const categoryTotals = {
        'Alimentação': 0,
        'Transporte': 0,
        'Moradia': 0,
        'Lazer': 0,
        'Outros': 0
    };

    expenses.forEach(item => {
        if (categoryTotals[item.category] !== undefined) {
            categoryTotals[item.category] += Number(item.amount);
        } else {
            categoryTotals['Outros'] += Number(item.amount);
        }
    });

    const dataValues = Object.values(categoryTotals);

    const ctx = document.getElementById('expenseChart').getContext('2d');

    // Se o gráfico já existe, destruímos ele antes de criar o novo para evitar bugs visuais
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    '#f87171', // Alimentação
                    '#fbbf24', // Transporte
                    '#34d399', // Moradia
                    '#60a5fa', // Lazer
                    '#a78bfa'  // Outros
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#d1d5db',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

// Função para adicionar nova transação
function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const newTransaction = {
        id: generateID(),
        description,
        amount,
        type,
        category,
        date
    };

    transactions.push(newTransaction);
    updateUI();
    transactionForm.reset();
}

// Função para remover transação
function removeTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    updateUI();
}

// Gerador de ID único
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Ouvindo o evento de envio
transactionForm.addEventListener('submit', addTransaction);

// Inicializando o app
updateUI();