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
        alert('Erro ao criar publicação!');
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
        alert('Erro ao curtir publicação!');
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
        alert('Erro ao descurtir publicação!');
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
        alert('Publicação atualizada com sucesso');
        Swal.fire(
            'Sucesso!',
            'Publicação criada com sucesso!',
            'success'
        )
    }).fail(() => {
        alert('Erro ao atualizar publicação!');
    }).always(() => {
        $(this).prop('disabled', true);
    });
}

function deletarPublicacao(evento) {
    evento.preventDefault();

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
        alert('Erro ao deletar publicação!');
    }).always(() => {
        elementoClicado.prop('disabled', false);
    });
}