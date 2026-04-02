// charts.js - Gráficos com Canvas puro (sem bibliotecas!)
class PieChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.colors = [
      '#6c5ce7', '#00b894', '#e17055',
      '#fdcb6e', '#0984e3', '#e84393',
      '#00cec9', '#fab1a0'
    ];
  }

  draw(data) {
    const { ctx, canvas } = this;
    const centerX = 150;
    const centerY = 150;
    const radius = 120;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
      ctx.fillStyle = '#dfe6e9';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#636e72';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Sem dados', centerX, centerY);
      return;
    }

    let startAngle = -Math.PI / 2;

    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * Math.PI * 2;

      // Fatia
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fill();

      // Porcentagem na fatia
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(midAngle) * (radius * 0.65);
      const labelY = centerY + Math.sin(midAngle) * (radius * 0.65);
      const percentage = ((item.value / total) * 100).toFixed(0);

      if (percentage > 5) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }

      startAngle += sliceAngle;
    });

    // Legenda
    const legendX = 340;
    let legendY = 30;

    data.forEach((item, i) => {
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fillRect(legendX, legendY - 10, 14, 14);
      ctx.fillStyle = '#2d3436';
      ctx.font = '13px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${item.label} - R$ ${item.value.toFixed(2)}`,
        legendX + 22, legendY + 2
      );
      legendY += 28;
    });
  }
}

class BarChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
  }

  draw(labels, incomeData, expenseData) {
    const { ctx, canvas } = this;
    const padding = 50;
    const barWidth = 25;
    const gap = 60;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxVal = Math.max(...incomeData, ...expenseData, 1);
    const chartHeight = canvas.height - padding * 2;

    labels.forEach((label, i) => {
      const x = padding + i * gap + 20;

      // Barra receita
      const incomeH = (incomeData[i] / maxVal) * chartHeight;
      ctx.fillStyle = '#00b894';
      ctx.fillRect(x, canvas.height - padding - incomeH, barWidth, incomeH);

      // Barra despesa
      const expenseH = (expenseData[i] / maxVal) * chartHeight;
      ctx.fillStyle = '#e17055';
      ctx.fillRect(x + barWidth + 4, canvas.height - padding - expenseH, barWidth, expenseH);

      // Label
      ctx.fillStyle = '#636e72';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + barWidth, canvas.height - padding + 18);
    });
  }
}