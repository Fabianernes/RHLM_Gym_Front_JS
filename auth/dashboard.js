// async function validarDocumento() {
//     var documento = document.getElementById('documento').value;
//     var mensajeError = document.getElementById('mensaje-error');

//     try {
//         let response = await fetch('http://localhost:8080/api/asistencia', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: new URLSearchParams({ identificacion: documento })
//         });

//         if (response.ok) {
//             await cargarAsistencias();
//             mensajeError.innerText = ''; // Limpiamos el mensaje de error si todo va bien
//         } else {
//             let result = await response.json();
//             mensajeError.innerText = result.message || 'Error al procesar la solicitud. Por favor, inténtelo de nuevo.';
//         }
//     } catch (error) {
//         mensajeError.innerText = 'Error en la conexión con el servidor. Por favor, inténtelo de nuevo.';
//     }
// }

async function validarDocumento() {
    var documento = document.getElementById('documento').value;
    var mensajeError = document.getElementById('mensaje-error');

    if (!documento || isNaN(documento)) {
        mensajeError.innerText = 'Recuerda ingresar solamente tu documento.';
        mensajeError.style.color = 'red';
        setTimeout(()=> {
            mensajeError.style.display = 'none';
        }, 4000);
        return;
    }

    try {
        let response = await fetch('http://localhost:8080/api/asistencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ identificacion: documento })
        });

        if (response.ok) {
            await cargarAsistencias();
            let result = await response.json();
            let diasRestantes = result.diasRestantes;

            // Mostrar mensaje de éxito
            mensajeError.innerText = `Sigue, te quedan ${diasRestantes} días para seguir entrenando. 💪🏼🏋🏽`;
            mensajeError.style.color = 'green'; 
            setTimeout(()=> {
                mensajeError.style.display = 'none';
            }, 4000);

        } else {
            let result = await response.json();
            mensajeError.innerText = result.message || 'Error al procesar la solicitud. Por favor, inténtelo de nuevo.';
            mensajeError.style.color = 'red'; 
        }
    } catch (error) {
        mensajeError.innerText = 'Error en la conexión con el servidor. Por favor, inténtelo de nuevo.';
        mensajeError.style.color = 'red'; 
    }
}


async function cargarAsistencias() {
    try {
        let response = await fetch('http://localhost:8080/api/asistencia/getAllAsistencia');
        if (response.ok) {
            let asistencias = await response.json();
            mostrarAsistencias(asistencias.reverse());
        } else {
            console.error('Error al obtener las asistencias:', response.status);
        }
    } catch (error) {
        console.error('Error en la conexión con el servidor:', error);
    }
}

function mostrarAsistencias(asistencias) {
    var tablaBody = document.querySelector('#tabla-asistencias tbody');
    tablaBody.innerHTML = ''; 

    for (let i = asistencias.length - 1; i >= 0; i--) {
        var asistencia = asistencias[i];
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${asistencia.nombreUsuario}</td>
            <td>${new Date(asistencia.fechaInicio).toLocaleDateString()}</td>
            <td>${new Date(asistencia.fechaFin).toLocaleDateString()}</td>
            <td>${asistencia.nombreSuscripcion}</td>
            <td>
                <button role="button" class="button-eliminar" onclick="eliminarAsistencia(${asistencia.id})">Eliminar</button>
            </td>
        `;
        tablaBody.insertBefore(row, tablaBody.firstChild);
    }
}

async function eliminarAsistencia(idAsistencia) {
    try {
        let response = await fetch(`http://localhost:8080/api/asistencia/${idAsistencia}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            await cargarAsistencias(); // Actualizamos la tabla después de eliminar
        } else {
            console.error('Error al eliminar la asistencia:', response.status);
        }
    } catch (error) {
        console.error('Error en la conexión con el servidor:', error);
    }
}

// Cargar las asistencias al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarAsistencias();
});
