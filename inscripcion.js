/* ------------------------------
   VARIABLES GLOBALES
------------------------------ */
let datosFormulario = {};

/* ------------------------------
   GUARDAR Y VALIDAR FORMULARIO
------------------------------ */
function guardarEnviar() {
    // Nuevos IDs del HTML
    const nombre = document.getElementById("nombre_estudiante").value.trim();
    const curso = document.getElementById("curso").value;
    const instrumento = document.getElementById("instrumento").value;
    const celularEstudiante = document.getElementById("celular_estudiante").value.trim();
    const nombreTutor = document.getElementById("nombre_tutor").value.trim();
    const celularTutor = document.getElementById("celular_tutor").value.trim();

    // Validación básica
    if (!nombre || !curso || !instrumento || !celularEstudiante || !nombreTutor || !celularTutor) {
        alert("⚠️ Por favor, complete todos los campos antes de continuar.");
        return;
    }

    // Fecha automática DD/MM/AAAA
    const fecha = new Date();
    const fechaInscripcion = fecha.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    // Guardar datos globales
    datosFormulario = {
        nombre,
        curso,
        instrumento,
        celularEstudiante,
        nombreTutor,
        celularTutor,
        fechaInscripcion
    };

    // 🔹 Enviar datos a Google Sheet
    enviarAGoogleSheet();

    // Cambiar pantalla
    document.getElementById("formulario").classList.add("hidden");
    document.getElementById("descargaSection").classList.remove("hidden");
}

/* ------------------------------
   ENVIAR DATOS A GOOGLE SHEET (SheetBest)
------------------------------ */
function enviarAGoogleSheet() {
    const datos = {
        "Nombre": datosFormulario.nombre,
        "Curso": datosFormulario.curso,
        "Instrumento": datosFormulario.instrumento,
        "Celular Estudiante": datosFormulario.celularEstudiante,
        "NombreTutor": datosFormulario.nombreTutor,
        "CelularTutor": datosFormulario.celularTutor,
        "Fecha Inscripción": datosFormulario.fechaInscripcion
    };

    const url = "https://api.sheetbest.com/sheets/5283c1b7-bbc4-4aa9-8bc4-1d94fc5c3e79";

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => console.log("✅ Datos enviados a Google Sheets:", data))
    .catch(error => console.error("❌ Error al enviar datos a Google Sheets:", error));
}

/* ------------------------------
   GENERAR PDF COMO COMPROBANTE
------------------------------ */
function descargarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Marco general
    doc.setDrawColor(0,0,0);
    doc.setLineWidth(1.2);
    doc.rect(10, 10, 190, 270);

    // Encabezado
    doc.setFillColor(70,120,240);
    doc.rect(10, 10, 190, 30, "F");

    doc.setFontSize(17);
    doc.setTextColor(255,255,255);
    doc.text("FICHA DE REGISTRO BANDA DE MÚSICA", 20, 22);

    doc.setFontSize(13);
    doc.text("U.E.THP JUPAPINA", 20, 32);
    doc.setFontSize(11);
    doc.text("Profesor: Humberto Yupanqui C.", 20, 40);

    // Cuerpo
    doc.setTextColor(0,0,0);
    doc.setFontSize(14);
    let y = 65;
    doc.text("Nombre y Apellido:", 20, y);            doc.text(datosFormulario.nombre, 85, y);
    doc.text("Curso:", 20, y+20);                     doc.text(datosFormulario.curso, 85, y+20);
    doc.text("Instrumento:", 20, y+40);               doc.text(datosFormulario.instrumento, 85, y+40);
    doc.text("Celular Estudiante:", 20, y+60);       doc.text(datosFormulario.celularEstudiante, 85, y+60);
    doc.text("Nombre Tutor:", 20, y+80);             doc.text(datosFormulario.nombreTutor, 85, y+80);
    doc.text("Celular Tutor:", 20, y+100);           doc.text(datosFormulario.celularTutor, 85, y+100);
    doc.text("Fecha de Inscripción:", 20, y+120);    doc.text(datosFormulario.fechaInscripcion, 85, y+120);

    // Pie de página
    doc.setFillColor(110,60,220);
    doc.rect(10, 260, 190, 20, "F");
    doc.setFontSize(12);
    doc.setTextColor(255,255,255);
    doc.text("Gracias por su registro", 70, 273);

    // Guardar PDF
    doc.save("Ficha_Estudiantil.pdf");
}

/* ------------------------------
   EXPORTAR DATOS A CSV (para Excel / Google Drive)
------------------------------ */
function exportarCSV() {
    const datos = datosFormulario;
    if (!datos.nombre) {
        alert("Primero debe guardar el formulario.");
        return;
    }

    const csvHeader = ["Nombre","Curso","Instrumento","Celular Estudiante","Nombre Tutor","CelularTutor","Fecha Inscripción"];
    const csvRow = [
        datos.nombre,
        datos.curso,
        datos.instrumento,
        datos.celularEstudiante,
        datos.nombreTutor,
        datos.celularTutor,
        datos.fechaInscripcion
    ];

    const csvContent = [csvHeader.join(","), csvRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Registro_Estudiantil.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ------------------------------
   BOTÓN SALIR
------------------------------ */
function salir() {
    window.location.reload(); // Recarga la página para reiniciar el formulario
}