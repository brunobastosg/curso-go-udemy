$('#parar-de-seguir').on('click', pararDeSeguir);
$('#seguir').on('click', seguir);
$('#editar-usuario').on('submit', editar);
$('#atualizar-senha').on('submit', atualizarSenha);
$('#deletar-usuario').on('click', deletarUsuario);

function pararDeSeguir() {
    const usuarioId = $(this).data('usuario-id');
    $(this).prop('disabled', true);

    $.ajax({
        url: `/usuarios/${usuarioId}/seguir`,
        method: 'DELETE'
    }).done(() => {
        window.location = `/usuarios/${usuarioId}`;
    }).fail(() => {
        Swal.fire('Ops...', 'Erro ao parar de seguir o usuário!', 'error');
        $('#parar-de-seguir').prop('disabled', false);
    });
}

function seguir() {
    const usuarioId = $(this).data('usuario-id');
    $(this).prop('disabled', true);

    $.ajax({
        url: `/usuarios/${usuarioId}/seguir`,
        method: 'POST'
    }).done(() => {
        window.location = `/usuarios/${usuarioId}`;
    }).fail(() => {
        Swal.fire('Ops...', 'Erro ao seguir o usuário!', 'error');
        $('#seguir').prop('disabled', false);
    });
}

function editar(evento) {
    evento.preventDefault();

    $.ajax({
        url: '/editar-usuario',
        method: 'PUT',
        data: {
            nome: $('#nome').val(),
            email: $('#email').val(),
            nick: $('#nick').val(),
        }
    }).done(() => {
        Swal.fire('Sucesso!', 'Usuário atualizado com sucesso!', 'success')
            .then(() => {
                window.location = '/perfil';
            });
    }).fail(() => {
        Swal.fire('Ops...', 'Erro ao atualizar o usuário!', 'error');
    });
}

function atualizarSenha(evento) {
    evento.preventDefault();

    if ($('#nova-senha').val() != $('#confirmar-senha').val()) {
        Swal.fire('Ops...', 'As senhas não coincidem!', 'warning');
        return;
    }

    $.ajax({
        url: '/atualizar-senha',
        method: 'POST',
        data: {
            atual: $('#senha-atual').val(),
            nova: $('#nova-senha').val(),
        }
    }).done(() => {
        Swal.fire('Sucesso!', 'A senha foi atualizada com sucesso!', 'success')
            .then(() => {
                window.location = '/perfil';
            });
    }).fail(() => {
        Swal.fire('Ops...', 'Erro ao atualizar a senha!', 'error');
    });
}

function deletarUsuario() {
    Swal.fire({
        title: 'Atenção!',
        text: 'Tem certeza que deseja apagar a sua conta? Essa ação é irreversível!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        icon: 'warning'
    }).then((confirmacao) => {
        if (confirmacao.value) {
            $.ajax({
                url: '/deletar-usuario',
                method: 'DELETE'
            }).done(() => {
                Swal.fire('Sucesso!', 'Seu usuário foi excluído com sucesso!', 'success')
                    .then(() => {
                        window.location = '/logout';
                    });
            }).fail(() => {
                Swal.fire('Ops...', 'Erro ao apagar a conta!', 'error');
            });
        }
    });
}