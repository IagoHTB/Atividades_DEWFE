const form = document.getElementById("formCadastro");
const resultado = document.getElementById("resultado");
const inputArquivo = document.getElementById("arquivo");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    resultado.innerHTML = "";

    const formData = new FormData(this);

    let interesses = [];

    let html = "<h4>Dados enviados:</h4>";

    for (let [campo, valor] of formData.entries()) {

        if (campo === "interesses") {
            interesses.push(valor);
        } 
        else if (campo !== "arquivo") {
            html += `<p><strong>${campo}:</strong> ${valor}</p>`;
        }
    }

    if (interesses.length > 0) {
        html += `<p><strong>Interesses:</strong> ${interesses.join(", ")}</p>`;
    }

    resultado.innerHTML = html;

    // TRATAMENTO DA IMAGEM
    const file = inputArquivo.files[0];

    if (file) {

        const tiposPermitidos = ["image/png", "image/jpeg"];

        if (!tiposPermitidos.includes(file.type)) {
            alert("Apenas PNG ou JPG.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Máximo 2MB.");
            return;
        }

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = "200px";
        img.style.display = "block";
        img.style.marginTop = "10px";

        resultado.appendChild(img);
    }
});