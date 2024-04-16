function validarDocumento() {
    var documento = document.getElementById('documento').value;
    if (documento === '1234566') {
        window.location.href = 'http://127.0.0.7:5500/auth/info/info.html';
    } else {
        document.getElementById('mensaje-error').innerText = 'El documento ingresado es incorrecto. Por favor, vuelva a intentarlo.';
    }
}
