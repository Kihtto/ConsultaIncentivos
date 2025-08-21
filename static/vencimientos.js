let escaneando = true;
let codigos = [];

console.log('asi se ve el console.log');

fetch('static/codigos.json')
  .then(res => res.json())
  .then(data => {
    codigos = data;
    console.log('se cargo el codigo.json')
    iniciarQuagga();
  })
  .catch(err => {
    console.error("Error al cargar codigos.json:", err);
    document.getElementById("resultadoVencimiento").innerHTML =
      "<p style='color: red;'>No se pudo cargar el archivo codigos.json.</p>";
  });

function iniciarQuagga() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#scanner-container"),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["ean_reader", "code_128_reader"]
    },
    locate: true
  }, function (err) {
    if (err) {
      console.error("Error al iniciar Quagga:", err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(result => {
    if (escaneando && result.codeResult.code) {
      const code = result.codeResult.code;
      document.getElementById("codigoInput").value = code;
      buscarVencimiento(code);
      console.log('se busco el codigo de barra')
      escaneando = false;
      setTimeout(() => {
        escaneando = true;
      }, 3000);
    }
  });
}

function buscarVencimiento(codigoManual = null) {
  const codigo = codigoManual || document.getElementById("codigoInput").value.trim();
  const resultado = document.getElementById("resultadoVencimiento");

  if (!codigo) {
    resultado.innerHTML = "<p>No se ha ingresado ningún código.</p>";
    return;
  }
  console.log('ahora se buscara el producto')
  console.log(codigo)
  console.log(codigos)
  const producto = codigos.find(p => p.Barras === codigo);

  if (producto) {
    resultado.innerHTML = `
      <div class="tarjeta">
        <h2>${producto.Descriptor}</h2>
        <p><strong>Código interno:</strong> ${producto.Codigo}</p>
        <p><strong>Vencimiento:</strong> ${producto["Mes de vencimiento a devolver"]}</p>
      </div>
    `;
  } else {
    resultado.innerHTML = `<p style="color: red;">Producto no encontrado para código ${codigo}</p>`;
  }
}
