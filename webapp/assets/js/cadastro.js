$('#formulario-cadastro').on('submit', criarUsuario);

function criarUsuario(evento) {
    evento.preventDefault();

    if ($('#senha').val() != $('#confirmar-senha').val()) {
        Swal.fire('Ops...', 'As senhas não coincidem!', 'error');
        return;
    }

    $.ajax({
        url: '/usuarios',
        method: 'POST',
        data: {
            nome: $('#nome').val(),
            email: $('#email').val(),
            nick: $('#nick').val(),
            senha: $('#senha').val()
        }
    }).done(() => {
        Swal.fire('Sucesso!', 'Usuário cadastrado com sucesso!', 'success')
            .then(() => {
                $.ajax({
                    url: '/login',
                    method: 'POST',
                    data: {
                        email: $('#email').val(),
                        senha: $('#senha').val()
                    }
                }).done(() => {
                    window.location = '/home';
                }).fail(() => {
                    Swal.fire('Ops...', 'Erro ao autenticar o usuário!', 'error');
                });
            });
    }).fail((erro) => {
        console.log(erro)
        Swal.fire('Ops...', 'Erro ao cadastrar o usuário!', 'error');
    });
}