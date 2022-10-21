$('#login').on('submit', fazerLogin);

function fazerLogin(evento) {
    evento.preventDefault();

    $.ajax({
        url: '/login',
        method: 'POST',
        data: {
            email: $('#email').val(),
            senha: $('#senha').val()
        }
    }).done(() => {
        window.location = '/home';
    }).fail((xhr, status, error) => {
        console.log(error);
        alert('Usuário ou senha inválidos!');
    });
}