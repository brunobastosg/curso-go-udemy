$('#nova-publicacao').on('submit', criarPublicacao);
$(document).on('click', '.curtir-publicacao', curtirPublicacao);
$(document).on('click', '.descurtir-publicacao', descurtirPublicacao);
$('#atualizar-publicacao').on('click', atualizarPublicacao);
$('.deletar-publicacao').on('click', deletarPublicacao);

function criarPublicacao(evento) {
    evento.preventDefault();

    $.ajax({
        url: '/publicacoes',
        method: 'POST',
        data: {
            titulo: $('#titulo').val(),
            conteudo: $('#conteudo').val()
        }
    }).done(() => {
        window.location = '/home';
    }).fail((erro, outro, maisOutro) => {
        console.log(erro);
        console.log(outro);
        console.log(maisOutro);
        Swal.fire('Ops...', 'Erro ao criar publicação!', 'error');
    });
}

function curtirPublicacao(evento) {
    evento.preventDefault();

    const elementoClicado = $(evento.target);
    const publicacaoId = elementoClicado.closest('div').data('publicacao-id');

    elementoClicado.prop('disabled', true);

    $.ajax({
        url: `/publicacoes/${publicacaoId}/curtir`,
        method: 'POST'
    }).done(() => {
        const contadorDeCurtidas = elementoClicado.next('span');
        const quantidadeDeCurtidas = parseInt(contadorDeCurtidas.text());
        contadorDeCurtidas.text(quantidadeDeCurtidas + 1);
        
        elementoClicado.addClass('descurtir-publicacao');
        elementoClicado.addClass('text-danger');
        elementoClicado.removeClass('curtir-publicacao');
    }).fail(() => {
        Swal.fire('Ops...', 'Erro ao curtir publicação!', 'error');
    }).always(() => {
        elementoClicado.prop('disabled', false);
    });
}

function descurtirPublicacao(evento) {
    evento.preventDefault();

    const elementoClicado = $(evento.target);
    const publicacaoId = elementoClicado.closest('div').data('publicacao-id');

    elementoClicado.prop('disabled', true);

    $.ajax({
        url: `/publicacoes/${publicacaoId}/curtir`,
        method: 'DELETE'
    }).done(() => {
        const contadorDeCurtidas = elementoClicado.next('span');
        const quantidadeDeCurtidas = parseInt(contadorDeCurtidas.text());
        contadorDeCurtidas.text(quantidadeDeCurtidas - 1);
        
        elementoClicado.removeClass('descurtir-publicacao');
        elementoClicado.removeClass('text-danger');
        elementoClicado.addClass('curtir-publicacao');
    }).fail(() => {
        Swal.fire('Ops...', 'Erro ao descurtir publicação!', 'error');
    }).always(() => {
        elementoClicado.prop('disabled', false);
    });
}

function atualizarPublicacao() {
    $(this).prop('disabled', false);

    const publicacaoId = $(this).data('publicacao-id');

    $.ajax({
        url: `/publicacoes/${publicacaoId}`,
        method: 'PUT',
        data: {
            titulo: $('#titulo').val(),
            conteudo: $('#conteudo').val()
        }
    }).done(() => {
        Swal.fire('Sucesso!', 'Publicação editada com sucesso!', 'success')
            .then(() => {
                window.location = '/home';
            });
    }).fail(() => {
        Swal.fire('Ops...', 'Erro ao atualizar publicação!', 'error');
    }).always(() => {
        $(this).prop('disabled', true);
    });
}

function deletarPublicacao(evento) {
    evento.preventDefault();

    Swal.fire({
        title: 'Atenção!',
        text: 'Tem certeza que deseja excluir essa publicação? Essa ação é irreversível!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        icon: 'warning'
    }).then((confirmacao) => {
        if (!confirmacao.value) return;

        const elementoClicado = $(evento.target);
        const publicacao = elementoClicado.closest('div');
        const publicacaoId = publicacao.data('publicacao-id');

        elementoClicado.prop('disabled', true);

        $.ajax({
            url: `/publicacoes/${publicacaoId}`,
            method: 'DELETE'
        }).done(() => {
            publicacao.fadeOut('slow', () => {
                $(this).remove();
            });
        }).fail(() => {
            Swal.fire('Ops...', 'Erro ao deletar publicação!', 'error');
        }).always(() => {
            elementoClicado.prop('disabled', false);
        });
    });
}