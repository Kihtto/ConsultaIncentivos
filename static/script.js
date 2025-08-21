let medicamentos = [];
let fuse;

fetch('static/df_foco.json')
  .then(res => res.json())
  .then(data => {
    medicamentos = data;
    fuse = new Fuse(medicamentos, {
      keys: ['Principio Activo'],
      threshold: 0.4, // Ajusta para mayor o menor flexibilidad
    });
  })
  .catch(err => console.error('Error cargando JSON:', err));

function buscar() {
  const query = document.querySelector('.buscador input').value.trim();
  const resultados = document.querySelector('.resultados');
  resultados.innerHTML = '';

  if (!query) return;

  const resultadosBusqueda = fuse.search(query);

  if (resultadosBusqueda.length === 0) {
    resultados.innerHTML = '<p>No se encontraron resultados.</p>';
    return;
  }

  resultadosBusqueda.forEach(result => {
    const med = result.item;
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.innerHTML = `
      <h2>${med['Descriptor']}</h2>
      <p><strong>Laboratorio:</strong> ${med['Empresa'] || 'No disponible'}</p>
      <p><strong>Actividad:</strong> ${med['Actividad'] || 'No disponible'}</p>
      <p><strong>% Comisión:</strong> ${(parseFloat(med['Mg  Franquiciado'])).toFixed(1)}%</p>
      <p><strong>Farmaco:</strong> ${med['Principio Activo']}</p>
      <p><strong>Precio:</strong>${med['Precio'] || 'No disponible'}</p>
    `;
    resultados.appendChild(tarjeta);
  });
}
