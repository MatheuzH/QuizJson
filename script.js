document.addEventListener("DOMContentLoaded", function() {
    var quizContainer = document.getElementById('quiz-container');
    var currentPage = 0; // Página atual do quiz
    var quizData; // Dados do quiz

    // Requisição AJAX para carregar os dados do quiz
    var request = new XMLHttpRequest();
    request.open('GET', 'quiz_data.json', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            quizData = JSON.parse(request.responseText);
            mostrarPagina(currentPage);
        } else {
            console.error('Erro ao carregar os dados do quiz.');
        }
    };

    request.onerror = function() {
        console.error('Erro de conexão.');
    };

    request.send();

    function mostrarPagina(page) {
        quizContainer.innerHTML = ''; // Limpar o contêiner antes de adicionar novas perguntas
        var pagina = quizData.paginas[page];

        if (pagina.capa) {
            var capaHTML = '<img src="' + pagina.capa.imagem + '" alt="' + pagina.capa.alt + '" style="max-width: 100%; border-radius: 10px; margin-bottom: 20px;">';
            quizContainer.innerHTML += capaHTML;
        }

        if (pagina.finalizacao) {
            var finalizacaoHTML = '<img src="' + pagina.finalizacao.imagem + '" alt="' + pagina.finalizacao.alt + '" style="max-width: 100%; border-radius: 10px; margin-bottom: 20px;">';
            finalizacaoHTML += '<h1>' + pagina.finalizacao.titulo + '</h1>';
            finalizacaoHTML += '<p>' + pagina.finalizacao.descricao + '</p>';
            quizContainer.innerHTML += finalizacaoHTML;
        } else {
            pagina.perguntas.forEach(function(pergunta, index) {
                var perguntaHTML = '<div class="pergunta">' + pergunta.pergunta + '</div>';
                perguntaHTML += '<div class="respostas">';
                pergunta.respostas.forEach(function(resposta) {
                    perguntaHTML += '<label><input type="radio" name="pergunta' + (index + (page * 2)) + '" value="' + resposta + '">' + resposta + '</label><br>';
                });
                perguntaHTML += '</div>';
                quizContainer.innerHTML += perguntaHTML;
            });

            var submitButton = document.createElement('button');
            submitButton.textContent = pagina.botao.texto;
            submitButton.disabled = true; // Botão desabilitado inicialmente
            submitButton.addEventListener('click', function() {
                if (page + 1 < quizData.paginas.length) {
                    currentPage++;
                    mostrarPagina(currentPage);
                }
            });
            quizContainer.appendChild(submitButton);

            // Verificar respostas selecionadas para habilitar o botão de próxima pergunta
            quizContainer.addEventListener('change', function(event) {
                var selectedInputs = quizContainer.querySelectorAll('input[type="radio"]:checked');
                if (selectedInputs.length === 2) {
                    submitButton.disabled = false;
                } else {
                    submitButton.disabled = true;
                }
            });
        }
    }
});
