// app.js - Lógica principal
const storage = new StorageManager('fincontrol_transactions');
const chart = new PieChart('expenseChart');

const categoryIcons = {
  alimentacao: '🍔', transporte: '🚗', moradia: '🏠',
  lazer: '🎮', salario: '💼', freelance: '💻',
  outros: '📦'
};

const categoryLabels = {
  alimentacao: 'Alimentação', transporte: 'Transporte',
  moradia: 'Moradia', lazer: 'Lazer',
  salario: 'Salário', freelance: 'Freelance'
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  setupEventListeners();
});

function setupEventListeners() {
  // FAB -> abrir modal
  document.getElementById('addTransaction').addEventListener('click', () => {
    document.getElementById('transactionModal').classList.add('active');
  });

  // Fechar modal
  document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('transactionModal').classList.remove('active');
  });

  // Submit form
  document.getElementById('transactionForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const transaction = {
      description: document.getElementById('desc').value,
      amount: parseFloat(document.getElementById('amount').value),
      type: document.getElementById('type').value,
      category: document.getElementById('category').value,
      date: document.getElementById('date').value
    };

    storage.add(transaction);
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionModal').classList.remove('active');

    renderDashboard();
    showToast('Transação adicionada! ✅');
  });

  // Navegação sidebar
  document.querySelectorAll('.sidebar nav li').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar nav li').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function renderDashboard() {
  const transactions = storage.getAll();

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // Atualizar cards
  document.getElementById('totalIncome').textContent = formatCurrency(income);
  document.getElementById('totalExpense').textContent = formatCurrency(expense);
  document.getElementById('totalBalance').textContent = formatCurrency(balance);
  document.getElementById('totalSavings').textContent = formatCurrency(Math.max(0, balance * 0.3));

  // Gráfico por categoria (só despesas)
  const categories = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

  const chartData = Object.entries(categories).map(([key, value]) => ({
    label: categoryLabels[key] || key,
    value
  }));

  chart.draw(chartData);

  // Lista de transações recentes
  const list = document.getElementById('transactionList');
  const recent = transactions.slice(-10).reverse();

  list.innerHTML = recent.map(t => `
    <div class="transaction-item">
      <div class="transaction-info">
        <div class="transaction-icon" style="background: ${
          t.type === 'income' ? 'rgba(0,184,148,0.1)' : 'rgba(225,112,85,0.1)'
        }">
          ${categoryIcons[t.category] || '📦'}
        </div>
        <div>
          <strong>${t.description}</strong>
          <p style="font-size:0.8rem;color:#636e72">
            ${categoryLabels[t.category] || t.category} • ${formatDate(t.date)}
          </p>
        </div>
      </div>
      <div>
        <span class="transaction-amount ${t.type}">
          ${t.type === 'income' ? '+' : '-'} ${formatCurrency(t.amount)}
        </span>
        <button onclick="deleteTransaction('${t.id}')"
                style="background:none;border:none;cursor:pointer;margin-left:8px">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function deleteTransaction(id) {
  if (confirm('Excluir esta transação?')) {
    storage.remove(id);
    renderDashboard();
    showToast('Transação removida! 🗑️');
  }
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '2rem', left: '50%',
    transform: 'translateX(-50%)', background: '#2d3436',
    color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px',
    zIndex: '9999', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}