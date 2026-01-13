export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    return;
  }

  // 1. Extrai os cabeçalhos (keys do primeiro objeto)
  const headers = Object.keys(data[0]);
  
  // 2. Converte os dados para linhas CSV
  const csvContent = [
    headers.join(','), // Linha de Cabeçalho
    ...data.map(row => 
      headers.map(header => {
        // Trata campos com vírgula ou aspas
        const cell = row[header] === null || row[header] === undefined ? '' : row[header];
        const stringCell = String(cell);
        return `"${stringCell.replace(/"/g, '""')}"`; // Escapa aspas duplas
      }).join(',')
    )
  ].join('\n');

  // 3. Cria o Blob e o Link de Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};