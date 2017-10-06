function initLogin() {
    var verificarEmail = false;
    var usuario = null;
    var config = null;
    var validaEmail = false;
    var produtos = [];
    var produtoCliente = [];
    var produtoSelecionado = null;
    var clientes = [];
    var itensOrcamento = [];
    var funcionario = null;
    var cliente = null;
    var url = "";

    function login() {
        if (verificarEmail == false) {
            var email = document.getElementById("email").value;
            if (email.indexOf("@") >= 0 && email.indexOf(".com") >= 0) {
                verificaEmail(email);
            }
        } else {
            verificaSenha(document.getElementById("password").value);
        }
    }

    //Verifica o E-mail
    function verificaEmail(email) {
        if (email.indexOf("@") >= 0 && email.indexOf(".com") >= 0) {
            request = $.ajax({
                url: url + "php/consultaEmail.php",
                type: "post",
                data: "email=" + email
            });
            request.done(function (response, textStatus, jqXHR) {
                document.getElementById("progress").style.display = "block";
                if (response != "0") {
                    usuario = JSON.parse(response);
                    document.getElementById("checkConect").innerHTML = "<p><input type='checkbox' id='manterConectado' /><label for='manterConectado'>Manter conectado</label></p>";
                    document.getElementById("nameLogin").innerHTML = "<label class='namePerson'>" + usuario.nome + "</label>";
                    document.getElementById("progress").style.display = "none";
                    document.getElementById("fieldEmail").style.display = "none";
                    document.getElementById("fieldPassword").style.display = "block";
                    document.getElementById("imgUser").style.backgroundImage = "url('uploads/" + usuario.perfil + "')";
                    document.getElementById("password").focus();
                    verificarEmail = true;
                } else {
                    document.getElementById("progress").style.display = "none";
                    document.getElementById("lEmail").setAttribute("data-error", "Não foi possível encontrar sua conta");
                    document.getElementById("email").setAttribute("class", "validate invalid");
                }
            });
            request.fail(function (jqXHR, textStatus, errorThrown) {
                console.error(
                    "The following error occurred: " +
                    textStatus, errorThrown
                    );
            });
        } else {
            document.getElementById("email").focus();
            document.getElementById("lEmail").setAttribute("data-error", "E-mail Invalido");
            document.getElementById("email").setAttribute("class", "validate invalid");

        }
    }

    function verificaEmailCadastro() {
        var email = document.getElementById("emailUser").value;
        if (email.indexOf("@") >= 0 && email.indexOf(".com") >= 0) {
            request = $.ajax({
                url: url + "php/consultaEmail.php",
                type: "post",
                data: "email=" + email
            });
            request.done(function (response, textStatus, jqXHR) {
                if (response != "0") {
                    document.getElementById("emailUser").focus();
                    document.getElementById("lEmailUser").setAttribute("data-error", "E-mail já possui cadastro");
                    document.getElementById("emailUser").setAttribute("class", "validate invalid");
                    validaEmail = false;
                } else {
                    validaEmail = true;
                    //document.getElementById("senhaUser").focus();
                }
            });
            request.fail(function (jqXHR, textStatus, errorThrown) {
                console.error(
                    "The following error occurred: " +
                    textStatus, errorThrown
                    );
            });
        } else {
            document.getElementById("emailUser").focus();
            document.getElementById("lEmailUser").setAttribute("data-error", "E-mail Invalido");
            document.getElementById("emailUser").setAttribute("class", "validate invalid");
        }
    }

    //Verifica a Senha
    function verificaSenha(senha) {
        document.getElementById("progress").style.display = "block";
        if (usuario.senha == senha) {
            var conexao = document.getElementById("manterConectado").checked;
            document.getElementById("checkConect").innerHTML = "";
            document.getElementById("progress").style.display = "none";
            document.getElementById("password").value = "";
            document.getElementById("containerLogin").style.display = "none";
            startSession(conexao);
        } else {
            document.getElementById("password").value = "";
            document.getElementById("progress").style.display = "none";
            document.getElementById("password").setAttribute("class", "validate invalid");
            document.getElementById("password").focus();
        }
    }

    //checa se  tem error de digitação
    function validaEmailUser(email) {
        var dominio = email.split("@");
        var subdominio = dominio[1].split(".");
        var error_subdominio = [];
        error_subdominio.push(["", "mail", "gmeil", "gmal", "gml", "gmil", "hotmeil", "hot", "yaho", "yaoo", "yao"], ["con", "cn", "cm", "co"], ["b", "or", "og", "rg"]);
        var result = 4;
        for (var i = 0; i < subdominio.length; i++) {
            if (!error_subdominio[i].indexOf(subdominio[i])) {
                result = i;
                break;
            }
        }
        switch (result) {
            case 0:
            document.getElementById("emailUser").focus();
            document.getElementById("lEmailUser").setAttribute("data-error", "Possivel erro de digitação: hotmail,yahoo,gmail");
            document.getElementById("emailUser").setAttribute("class", "validate invalid");
            break;
            case 1:
            document.getElementById("emailUser").focus();
            document.getElementById("lEmailUser").setAttribute("data-error", "Possivel erro de digitação: com");
            document.getElementById("emailUser").setAttribute("class", "validate invalid");
            break;
            case 2:
            document.getElementById("emailUser").focus();
            document.getElementById("lEmailUser").setAttribute("data-error", "Possivel erro de digitação: br,org");
            document.getElementById("emailUser").setAttribute("class", "validate invalid");
            break;
        }

    }

    //inicia a sessao
    function startSession(conectado) {
        request = $.ajax({
            url: url + "php/startSession.php",
            type: "get",
            data: "idusuario=" + usuario.idlogin + "&conexao=" + conectado
        });
        request.done(function (response, textStatus, jqXHR) {
            //checa se o usuario esta logado
            verificaLogin();
            console.log("Sessao Iniciada");
        });
        request.fail(function (jqXHR, textStatus, errorThrown) {
            console.error(
                "The following error occurred: " +
                textStatus, errorThrown
                );
        });
    }

    //verifica se esta logado
    function verificaLogin() {
        request = $.ajax({
            url: url + "php/checkSession.php",
            type: "post"
        });
        request.done(function (response, textStatus, jqXHR) {
            usuario = JSON.parse(response);
            if (usuario != "0") {
                document.getElementById("containerLogin").style.display = "none";
                incluirPainel();
            } else {
                document.title = "Login";
                document.getElementById("checkConect").innerHTML = "";
                document.getElementById("nameLogin").innerHTML = "<h4> Login</h4>";
                document.getElementById("progress").style.display = "none";
                document.getElementById("fieldEmail").style.display = "block";
                document.getElementById("fieldPassword").style.display = "none";
                document.getElementById("fLogin").style.display = "block";
                //document.getElementById("fCadastro").style.display = "none";
                document.getElementById("containerLogin").style.display = "block";
                verificarEmail = false;
                document.getElementById("email").addEventListener("keypress", function () {
                    if (event.keyCode == 13) login();
                });
                document.getElementById("password").addEventListener("keypress", function () {
                    if (event.keyCode == 13) login();
                });
                document.getElementById("logar").addEventListener("click", function () {
                    login();
                });
            }
            console.log("Sessao Verificada");
        });
        request.fail(function (jqXHR, textStatus, errorThrown) {
            console.error(
                "The following error occurred: " +
                textStatus, errorThrown
                );
        });
    }

    //logout
    function logout() {
        request = $.ajax({
            url: url + "php/logout.php",
            type: "post"
        });
        request.done(function (response, textStatus, jqXHR) {
            desativar();
            verificaLogin();
            console.log("Verificando Login");
        });
    }

    //Chama a tela de cadastro
    function cadastro() {
        document.getElementById("nameLogin").innerHTML = "<h4>Cadastro</h4>";
        document.getElementById("fLogin").style.display = "none";
        document.getElementById("fCadastro").style.display = "block";
        document.getElementById("nome").focus();
    }

    function EnterTab(InputId, Evento) {
        if (Evento.keyCode == 13) {
            document.getElementById(InputId).focus();
        }
    }

    //Salva o usuario
    function salvaUsuario() {
        $('#modalpreload').modal('open');
        var x = document.getElementById("file");
        var file_data = x.files[0];
        var form_data = new FormData();
        // form_data.append('file', file_data);
        form_data.append('nome', $('#nome').val());
        form_data.append('email', $('#emailUserNovo').val());
        form_data.append('senha', $('#senhaUserNovo').val());
        form_data.append('permissao', $('#tipoUsuario').val());
        if(cliente != null){
            form_data.append('codparticipante', cliente.PAR_PKN_CODIGO);
        }
        $.ajax({
            type: "POST",
            url: url + "php/salvaUsuario.php",
            data: form_data,
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: false,    	// Data sent to server, a set of key/value pairs (i.e. form fields and values)
            success: function (data) {
                console.log(data);
                document.getElementById('nome').value = "";
                document.getElementById('emailUserNovo').value = "";
                document.getElementById('senhaUserNovo').value = "";
                document.getElementById("titleModal").innerHTML = "";
                document.getElementById("msgModal").innerHTML = "Usuario salvo com sucesso";
                document.getElementById("autocomplete-input").value = "";
                $('#modalpreload').modal('close');
                $('#modalInfo').modal('open');
                preencheClientes();
                //todosFuncionarios();
                //inicarClientesNegociacao();
            }
        });

    }

    function salvaNegociacao() {

        $('#modalpreload').modal('open');
        var form_data = new FormData();

        if (cliente == null) {
            alert("SELECIONE O USUARIO");
            return;
        }
        if ($('#produtos_negociacao').val() == null) {
            alert("SELECIONE O PRODUTO");
            return;
        }
        if (removeMascara($('#precoproduto').val()) == 0 || $('#precoproduto').val().length == 0) {
            alert("INFORME O VALOR DO PRODUTO");
            return;
        }
        form_data.append('idusuario', cliente);
        form_data.append('idproduto', $('#produtos_negociacao').val());
        form_data.append('valor', removeMascara($('#precoproduto').val()));

        $.ajax({
            type: "POST",
            url: url + "php/salvaNegociacao.php",
            type: "POST",             // Type of request to be send, called as method
            data: form_data, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: false,        // To send DOMDocument or non processed data file it is set to false
            success: function (data) {
                document.getElementById("precoproduto").value = "";
                document.getElementById("titleModal").innerHTML = "Resultado:";
                document.getElementById("msgModal").innerHTML = "Produto salvo com sucesso";
                $('#modalpreload').modal('close');
                mostraProdutosCliente(cliente);
            }
        });
    }

    function incluirPainel() {

     document.getElementById("container").style.display = "block";
     $(document).ready(function () {
        $('.collapsible').collapsible();
        $('.modal').modal();
        $('.modalpreloader').modal({
                    dismissible: false, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    inDuration: 300, // Transition in duration
                    outDuration: 200, // Transition out duration
                    startingTop: '50%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                    },
                    complete: function () {
                        //$('#modalInfo').modal('open');
                    } // Callback for Modal close
                }
                );
        $('#modalSelecionaProduto').modal({
                    dismissible: false, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    inDuration: 300, // Transition in duration
                    outDuration: 200, // Transition out duration
                    startingTop: '50%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                    },
                    complete: function () {
                        //$('#modalInfo').modal('open');
                    } // Callback for Modal close
                }
                );
        $(".button-collapse").sideNav();
        $('select').material_select();
        $('#modalpreload').modal('open');

    });
     initConfiguracao();

 }

 verificaLogin();

 function consultaPermissoes() {

    console.log(usuario.idpermissao);
    if(usuario.idpermissao == 1 ||  usuario.idpermissao == 2){
         document.getElementById("tabs-menu").style.display = "block"
         $('ul.tabs').tabs('select_tab', 'home');
         document.getElementById("menu_cadastros").style.display = "block";
         document.getElementById("menu_pedidos").style.display = "block";
         document.getElementById("btnConfiguracao").style.display = "block";
         document.getElementById("btnConfiguracaoMobile").style.display = "block";
    }
    if(usuario.idpermissao == 3){
        document.getElementById("tabs-menu").style.display = "none";
        $('ul.tabs').tabs('select_tab', 'pedidos');
        document.getElementById("funcionario_orcamento").style.display = "block";
        document.getElementById("selectCliente").style.display = "block";
    }
    // if(usuario.idpermissao == 4){
    //     document.getElementById("tabs-menu").style.display = "none";
    //     $('ul.tabs').tabs('select_tab', 'pedidos');
    //     document.getElementById("funcionario_orcamento").style.display = "block";
    //     document.getElementById("selectCliente").style.display = "block";
    //     document.getElementById("selectCliente").style.display = "none";
    //     document.getElementById("addItens").style.display = "block";
    //     document.getElementById("menu_pedido").style.display = "none";

    //     document.getElementById("infoNome").innerHTML = "RAZAO SOCIAL: "+usuario.user.PAR_A_RAZAOSOCIAL;
    //     document.getElementById("infoCpfCnpj").innerHTML = "CNPJ/CPF: "+usuario.user.PAR_A_CNPJ_CPF;
    //     document.getElementById("infoEndereco").innerHTML = "ENDERECO: "+usuario.user.PAR_A_LOGRADOURO+" "+usuario.user.PAR_A_ENDERECO+" "+cliente.PAR_A_NUMERO;
    //     selectProdutoCliente(, "produto_orcamento");
    // }

}

function todosProdutos() {
    $.ajax({
        url: url + "php/todosProdutos.php",
        type: "POST",
        success: function (json) {
            var result = JSON.parse(json);
            produtos = result;
            var selects = "<option value='' disabled selected>SELECIONE UM PRODUTO</option>";
            for (var i = 0; i < result.length; i++) {
                selects += "<option value='" + result[i].PRO_PKN_CODIGO + "' >" + result[i].PRO_A_DESCRICAO_REDUZIDA.toUpperCase() + "</option>";
            }
            document.getElementById("produtos_negociacao").innerHTML = selects;
            $('select').material_select();
        }
    });
}

    //tras todos os produtos
    function mostraProdutos() {
        $.ajax({
            url: url + "php/todosProdutosPedidos.php",
            type: "POST",
            success: function (json) {
                var result = JSON.parse(json);
                var item = "";
                for (var i = 0; i < result.length; i++) {
                    var tabela = "";
                    tabela += '<table class="striped centered responsive-table">';
                    tabela += '<thead>';
                    tabela += '<tr>';
                    tabela += '<th>ORCAMENTO</th>';
                    tabela += '<th>CLIENTE</th>';
                    tabela += '<th>QUANTIDADE</th>';
                    tabela += '</tr>';
                    tabela += '</thead>';
                    tabela += '<tbody id="produtos_orcamentos">';
                    var produto = result[i].orcamentos;
                    var descricao = result[i].descricao;
                    for (var j = 0; j < produto.length; j++) {
                        tabela += "<tr><td>" + produto[j].idorcamento + "</td><td>" + produto[j].usuario.toUpperCase() + "</td><td>" + produto[j].qtde + "</td></tr>";
                    }
                    tabela += '</tbody>';
                    tabela += '</table>';

                    var img = "";
                    item += '<li>';
                    item += '<div class="collapsible-header"><div class="item_home">' + result[i].qtdePedido + '</div>' + result[i].descricao.toUpperCase() + ' </div>';
                    item += '<div class="collapsible-body">' + tabela + '<span></span></div>';
                    item += '</li>';
                }
                document.getElementById("produtos").innerHTML = item;
            }
        });
    }

    //Mostra o produtos do cliente na tabela
    function mostraProdutosCliente(idusuario) {
        $.ajax({
            url: url + "php/getProdutosCliente.php",
            type: "POST",
            data: {"idusuario": idusuario},
            success: function (json) {
                var result = JSON.parse(json);
                var rows = "";
                for (var i = 0; i < result.length; i++) {
                    rows += "<tr><td>" + result[i].descricao.toUpperCase() + "</td><td style='text-align:right'>" + numberToReal(result[i].valor) + "</td></tr>"
                }
                document.getElementById("detalhe_negociacao").innerHTML = rows;
            }
        });
    }

    //Incluir os produtos do cliente dentro do select
    function selectProdutoCliente(cliente, select) {
        $('#modalpreload').modal('open');
        $.ajax({
            url: url + "php/getProdutosCliente.php",
            type: "POST",
            data: {"codigo": cliente.TAB_PKN_CODIGO},
            success: function (json) {
                document.getElementById("autocomplete-fantasia").placeholder = " ";
                document.getElementById("autocomplete-fantasia").value = cliente.PAR_A_NOME_FANTASIA;
                document.getElementById("cpfcnpj").placeholder = " ";
                document.getElementById("cpfcnpj").value = cliente.PAR_A_CNPJ_CPF;
                var result = JSON.parse(json);
                produtoCliente = result;
                var nomes = {};
                for (var i = 0; i < result.length; i++) {
                   nomes[result[i].descricao] =  i ;
               }
               $('input.autoproduto').autocomplete({
                 data: nomes,
                    limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
                    onAutocomplete: function (val) {
                        produtoSelecionado = produtoCliente[nomes[val]];
                        document.getElementById("precoProduto").value = numberToReal( produtoSelecionado.valor);
                    },
                    minLength: 1,
                });
               $('#modalpreload').modal('close');
           }
       });
    }

    //Inicia a Configuração de Layout e Eventos
    function initConfiguracao() {

        request = $.ajax({
            url: url + "php/configuracao.php",
            type: "POST"
        });
        request.done(function (response, textStatus, jqXHR) {
            //pega a configuração e colocar e jogar na tela
            config = JSON.parse(response);
            document.getElementById("menu_painel").style.background = config.cor_menu;
            document.getElementById("conteudo_painel").style.background = config.cor_conteudo;
            document.getElementById("container").style.background = config.cor_fundo;
            document.getElementsByTagName("body")[0].style.background = config.cor_fundo;
            document.getElementById("logo").src = "assets/icon/" + config.logo;
            document.title = config.nome_empresa;

            preencheClientes();

            //tela de configuracao de layout
            document.getElementById("btnConfiguracao").addEventListener("click", function () {
                abrirConfiguracao();
            });
            //logout
            document.getElementById("logout").addEventListener("click", function () {
                logout();
            });
            //abri as configuração de cores da tela
            document.getElementById("btnConfiguracaoMobile").addEventListener("click", function () {
                $('.button-collapse').sideNav('hide');
                abrirConfiguracao();
            });
            //Faz logout
            document.getElementById("logoutMobile").addEventListener("click", function () {
                $('.button-collapse').sideNav('hide');
                logout();
            });

            // Salva o Usuario
            document.getElementById("btnSalvaUsuario").addEventListener("click", function () {
                salvaUsuario();
            });

            //HABILITA O FORMULARIO DE PEDIDO
            document.getElementById("btnOrcamento").addEventListener("click", function () {
                if (usuario.tipo == "GERENTE") {
                    document.getElementById("criar_orcamento").style.display = "block";
                } else if (usuario.tipo == "FUNCIONARIO") {
                    document.getElementById("funcionario_orcamento").style.display = "block";
                    document.getElementById("selectCliente").style.display = "block";
                }
                document.getElementById("todosOrcamento").style.display = "none";
                preencheClientes();
            });
            document.getElementById("btnOrcamentoMobile").addEventListener("click", function () {
                if (usuario.tipo == "GERENTE") {
                    document.getElementById("criar_orcamento").style.display = "block";
                } else if (usuario.tipo == "FUNCIONARIO") {
                    document.getElementById("funcionario_orcamento").style.display = "block";
                    document.getElementById("selectCliente").style.display = "block";
                }
                document.getElementById("todosOrcamento").style.display = "none";
                preencheClientes();
            });
            //FUNÇÕE DO ORCAMENTO DO FUNCIONARIO
            document.getElementById("btnOrcaProximo").addEventListener("click", function () {
                if (cliente != null) {
                    document.getElementById("selectCliente").style.display = "none";
                    document.getElementById("addItens").style.display = "block";
                    document.getElementById("menu_pedido").style.display = "none";

                    document.getElementById("infoNome").innerHTML = "RAZAO SOCIAL: "+cliente.PAR_A_RAZAOSOCIAL;
                    document.getElementById("infoCpfCnpj").innerHTML = "CNPJ/CPF: "+cliente.PAR_A_CNPJ_CPF;
                    document.getElementById("infoEndereco").innerHTML = "ENDERECO: "+cliente.PAR_A_LOGRADOURO+" "+cliente.PAR_A_ENDERECO+" "+cliente.PAR_A_NUMERO;
                    selectProdutoCliente(cliente, "produto_orcamento");
                } else {
                    Materialize.Toast.removeAll();
                    Materialize.toast('Por favor selecione o cliente', 4000);
                }

            });

            // document.getElementById("retornaOrcamento").addEventListener("click", function () {
            //     document.getElementById("selectCliente").style.display = "block";
            //     document.getElementById("addItens").style.display = "none";
            //     document.getElementById("menu_painel").style.display = "block";
            //     document.getElementById("menu_pedido").style.display = "block";
            //     document.getElementById("datelhe_item").innerHTML = "";
            //     itensOrcamento = [];
            // });
            document.getElementById("addItemOrca").addEventListener("click", function () {
                var item = new Object();
                item.produto = produtoSelecionado;
                if (item.produto != null) {
                    item.qtde = $("#qtdeProduto").val();
                    item.total = item.produto.valor * item.qtde;
                    var existe = false;
                    //CHECA SE O ITEM JÁ EXISTE
                    var total = 0;
                    for (var i = 0; i < itensOrcamento.length; i++) {
                        if (itensOrcamento[i].produto.idproduto == item.produto.idproduto) {
                            itensOrcamento[i] = item;
                            existe = true;
                        }
                        total = total + itensOrcamento[i].total;
                    }
                    //SE NÃO EXISTIR ELE ADICIONA
                    if (existe == false) {
                        total = total + item.total;
                        itensOrcamento.push(item);
                        var itens = document.getElementById("datelhe_item").innerHTML;;
                        itens += '<li class="col s12" >';
                        itens +=    '<div class="collapsible-header" style="color: #000;">' + item.produto.descricao.toUpperCase() + '</div>';
                        itens +=    '<div class="collapsible-body" style="background-color: #868c90;color: #fff;"><span> Quantidade: ' + item.qtde +'</br> Preço: ' + numberToReal(item.produto.valor) +'</br> Total: '+ numberToReal(itensOrcamento[i].total) +'</span></div>';
                        itens += '</li>';
                        document.getElementById("datelhe_item").innerHTML = itens;
                    } else {
                        //SE EXISTIR ELE REFAZ A TABELA E ALTERAR OS VALORES DO ITEM
                        document.getElementById("datelhe_item").innerHTML = "";
                        total = 0;
                        for (var i = 0; i < itensOrcamento.length; i++) {
                            var itens = document.getElementById("datelhe_item").innerHTML;
                            var itens = document.getElementById("datelhe_item").innerHTML;;
                            itens += '<li class="col s12" >';
                            itens +=    '<div class="collapsible-header" style="color: #000;">' + item.produto.descricao.toUpperCase() + '</div>';
                            itens +=    '<div class="collapsible-body" style="background-color: #868c90;color: #fff;"><span> Quantidade: ' + item.qtde +'</br> Preço: ' + numberToReal(item.produto.valor) +'</br> Total: '+ numberToReal(itensOrcamento[i].total) +'</span></div>';
                            itens += '</li>';
                            document.getElementById("datelhe_item").innerHTML = itens;
                            total = total + parseFloat(itensOrcamento[i].total);
                        }
                    }
                    document.getElementById("totalOrcamento").value = numberToReal(total);
                    document.getElementById("produto_orcamento").value = "";
                    $("#qtdeProduto").val("");
                }
            });
            //Finalizar Orcamento
            document.getElementById("btnFinalizaOrcamento").addEventListener("click",function(){
                $('#modalpreload').modal('open');
                var orcamento = new Object();
                orcamento.usuario = cliente;
                orcamento.funcionario = funcionario;
                var total = document.getElementById("totalpedido").value;
                total = total.replace(",", ".");
                orcamento.total = parseFloat(total);
                orcamento.itens = itensOrcamento;
                console.log(orcamento);
                var dado = JSON.stringify(orcamento);
                $.ajax({
                    url: url + "php/salvaOrcamento.php",
                    type: "POST",
                    data: {"dado": dado},
                    success: function (json) {
                        $(".autocliente").val("");
                        $(".autocomplete").val("");
                        document.getElementById("detalhe_pedido").innerHTML = "";
                        document.getElementById("preconegociado").value = "";
                        document.getElementById("totalpedido").value = "";
                        document.getElementById("totalOrcamento").value = "0,00";
                        document.getElementById("autocomplete-fantasia").value = "";
                        document.getElementById("cpfcnpj").value = "";
                        document.getElementById("totalOrcamento").value = "0,00";
                        $("#qtde").val("");
                        document.getElementById("produtos_pedido").innerHTML = "<option value='' disabled selected>SELECIONE UM PRODUTO</option>";
                        document.getElementById("titleModal").innerHTML = "Resultado:";
                        document.getElementById("msgModal").innerHTML = "Orcamento enviado com sucesso";
                        document.getElementById("btnSalvaOrcamento").style.display = "none";
                        document.getElementById("selectCliente").style.display = "block";
                        document.getElementById("addItens").style.display = "none";
                        document.getElementById("menu_painel").style.display = "block";
                        document.getElementById("menu_pedido").style.display = "block";
                        document.getElementById("datelhe_item").innerHTML = "";
                        itensOrcamento = [];
                        $('#modalpreload').modal('close');
                        $('#modalInfo').modal('close');
                    }
                });
            });

            //ADICIONA O ITEM NA LISTA DE ITENS DO PEDIDO
            document.getElementById("btnAdicionarItem").addEventListener("click", function () {
                var item = new Object();
                item.produto = produtoCliente[$("#produtos_pedido").val()];
                if (item.produto != null) {
                    item.qtde = $("#qtde").val();
                    item.total = item.produto.valor * item.qtde;
                    var existe = false;
                    //CHECA SE O ITEM JÁ EXISTE
                    var total = 0;
                    for (var i = 0; i < itensOrcamento.length; i++) {
                        if (itensOrcamento[i].produto.idproduto == item.produto.idproduto) {
                            itensOrcamento[i] = item;
                            existe = true;
                        }
                        total = total + itensOrcamento[i].total;
                    }
                    //SE NÃO EXISTIR ELE ADICIONA
                    if (existe == false) {
                        total = total + item.total;
                        itensOrcamento.push(item);
                        var itens = document.getElementById("detalhe_pedido").innerHTML;
                        itens += "<tr><td>" + item.produto.descricao.toUpperCase() + "</td><td>" + item.qtde + "</td><td>" + numberToReal(item.produto.valor) + "</td><td>" + numberToReal(item.total) + "</td><td><img src='assets/icon/remove.png'></td></tr>"
                        document.getElementById("detalhe_pedido").innerHTML = itens;
                        document.getElementById("totalpedido").value = numberToReal(total);
                    } else {
                        //SE EXISTIR ELE REFAZ A TABELA E ALTERAR OS VALORES DO ITEM
                        document.getElementById("detalhe_pedido").innerHTML = "";
                        total = 0;
                        for (var i = 0; i < itensOrcamento.length; i++) {
                            var itens = document.getElementById("detalhe_pedido").innerHTML;
                            itens += "<tr><td>" + itensOrcamento[i].produto.descricao.toUpperCase() + "</td><td>" + itensOrcamento[i].qtde + "</td><td>" + numberToReal(itensOrcamento[i].produto.valor) + "</td><td>" + numberToReal(itensOrcamento[i].total) + "</td><td><img src='assets/icon/remove.png'></td></tr>"
                            document.getElementById("detalhe_pedido").innerHTML = itens;
                            total = total + parseFloat(itensOrcamento[i].total);
                        }

                        document.getElementById("totalpedido").value = numberToReal(total);
                    }
                    $("#qtde").val("");
                    document.getElementById("btnSalvaOrcamento").style.display = "block";
                }
            });

               //salva o orcamento
               document.getElementById("btnSalvaOrcamento").addEventListener("click", function () {
                $('#modalpreload').modal('open');
                var orcamento = new Object();
                orcamento.usuario = cliente;
                orcamento.funcionario = funcionario;
                var total = document.getElementById("totalpedido").value;
                total = total.replace(",", ".");
                orcamento.total = parseFloat(total);
                orcamento.itens = itensOrcamento;
                console.log(orcamento);
                var dado = JSON.stringify(orcamento);
                $.ajax({
                    url: url + "php/salvaOrcamento.php",
                    type: "POST",
                    data: {"dado": dado},
                    success: function (json) {
                        $(".autocliente").val("");
                        $(".autocomplete").val("");
                        document.getElementById("detalhe_pedido").innerHTML = "";
                        document.getElementById("preconegociado").value = "";
                        document.getElementById("totalpedido").value = "";
                        $("#qtde").val("");
                        document.getElementById("produtos_pedido").innerHTML = "<option value='' disabled selected>SELECIONE UM PRODUTO</option>";
                        document.getElementById("titleModal").innerHTML = "Resultado:";
                        document.getElementById("msgModal").innerHTML = "Orcamento enviado com sucesso";
                        document.getElementById("btnSalvaOrcamento").style.display = "none";
                        document.getElementById("selectCliente").style.display = "block";
                        document.getElementById("addItens").style.display = "none";
                        document.getElementById("menu_painel").style.display = "block";
                        document.getElementById("menu_pedido").style.display = "block";
                        document.getElementById("datelhe_item").innerHTML = "";
                        itensOrcamento = [];
                        $('#modalpreload').modal('close');
                        $('#modalInfo').modal('close');
                    }
                });
            });

               document.getElementById("verOrcamentos").addEventListener("click", listaOrcamentos);
               document.getElementById("verOrcamentosMobile").addEventListener("click", listaOrcamentos);
               $("#tipoUsuario").change(function(){
                if($(this).val() == 4){
                    document.getElementById("selecioneCliente").style.display = 'block';
                }else{
                    document.getElementById("selecioneCliente").style.display = 'none';
                }
            });
            //Mascara Moeda no Campo
            $("input#precoproduto").maskMoney({showSymbol: true, symbol: "R$", decimal: ",", thousands: "."});
            consultaPermissoes();
            //todosProdutos();
            $('#modalpreload').modal('close');
        });
}

    //tras todos os orcamentos do cliente
    function listaOrcamentos() {
        document.getElementById("todosOrcamento").style.display = "block";
        document.getElementById("criar_orcamento").style.display = "none";
        document.getElementById("funcionario_orcamento").style.display = "none";
        $.ajax({
            url: url + "php/getOrcamentos.php",
            type: "POST",
            success: function (json) {
                var result = JSON.parse(json);
                var listaorcamentos = "";
                for (var i = 0; i < result.length; i++) {
                    listaorcamentos += '<div class="col s12 m3 l3">';
                    listaorcamentos += '<div class="card">';
                    listaorcamentos += '<div class="card-content">';
                    listaorcamentos += '<span class="card-title">' + result[i].nome.toUpperCase() + '</span>';
                    listaorcamentos += '</div>';
                    listaorcamentos += '<div class="card-action" style="text-align: right;padding: 5% 0px;">';
                    listaorcamentos += '<a style="padding: 5%;margin: 0;background-color: #e55050;color: #fff;">' + numberToReal(result[i].total) + '</a>';
                    listaorcamentos += '</div>';
                    listaorcamentos += '</div>';
                    listaorcamentos += '</div>';
                }
                document.getElementById("todosOrcamento").innerHTML = listaorcamentos;
            }
        });
    }

    //preenche o select com os clientes
    function preencheClientes() {
        $.ajax({
            url: url + "php/getClientes.php",
            type: "POST",
            success: function (json) {
                var result = JSON.parse(json);
                clientes = result;
                var nomes = {};
                for (var i = 0; i < result.length; i++) {
                    nomes[result[i].PAR_A_RAZAOSOCIAL.toUpperCase()] = i;
                }
                $('input.autocliente').autocomplete({
                    data: nomes,
                    limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
                    onAutocomplete: function (val) {
                        cliente = result[nomes[val]];
                        selectProdutoCliente(cliente, "produtos_pedido");

                        $('#produtos_pedido').on('change', function (e) {
                            var item = produtoCliente[$("#produtos_pedido").val()];
                            $("#preconegociado").val(numberToReal(item.valor));
                        });
                    },
                    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
                });
            }
        });
    }

    //pegar todos os funcionarios e coloca no autocomplete
    function todosFuncionarios() {
        $.ajax({
            url: url + "php/getFuncionarios.php",
            type: "POST",
            success: function (json) {
                console.log(json);
                var users = JSON.parse(json);
                var nomes = {};
                for (var i = 0; i < users.length; i++) {
                    nomes[users[i].nome.toUpperCase()] = users[i].idusuario;
                }
                $('input.autocomplete').autocomplete({
                    data: nomes,
                    limit: 10, // The max amount of results that can be shown at once. Default: Infinity.
                    onAutocomplete: function (val) {
                        funcionario = nomes[val];
                        getPermissoes(funcionario);
                    },
                    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
                });
            }
        });
    }


    //Habilitar a tela de configuração de layout do usuario
    function abrirConfiguracao() {
        document.getElementById("configuracao").style.display = "block";
        document.getElementById("cor_menu").value = config.cor_menu;
        document.getElementById("cor_fundo").value = config.cor_fundo;
        document.getElementById("cor_conteudo").value = config.cor_conteudo;
        document.getElementById("nome_empresa").value = config.nome_empresa;
        document.getElementById("cor_menu").addEventListener("change", function () {
            document.getElementById("menu_painel").style.background = document.getElementById("cor_menu").value;
        });
        document.getElementById("cor_conteudo").addEventListener("change", function () {
            document.getElementById("conteudo_painel").style.background = document.getElementById("cor_conteudo").value;
        });
        document.getElementById("cor_fundo").addEventListener("change", function () {
            document.getElementById("container").style.background = document.getElementById("cor_fundo").value;
            document.getElementsByTagName("body")[0].style.background = document.getElementById("cor_fundo").value;
        });
        document.getElementById("btnSalvaConfig").addEventListener("click", function () {
            var file_data = document.getElementById("fileLogo").files[0];
            var form_data = new FormData();
            form_data.append('file', file_data);
            form_data.append('cor_fundo', document.getElementById("cor_fundo").value);
            form_data.append('cor_conteudo', document.getElementById("cor_conteudo").value);
            form_data.append('cor_menu', document.getElementById("cor_menu").value);
            form_data.append('nome_empresa', document.getElementById("nome_empresa").value);
            request = $.ajax({
                type: "POST",
                url: url + "php/salvaConfiguracao.php",
                type: "POST",             // Type of request to be send, called as method
                data: form_data, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                contentType: false,       // The content type used when sending data to the server.
                cache: false,             // To unable request pages to be cached
                processData: false,        // To send DOMDocument or non processed data file it is set to false
                success: function (data) {
                    document.getElementById("configuracao").style.display = "none";
                    document.title = document.getElementById("nome_empresa").value;
                }
            });
        });
        document.getElementById("fileLogo").addEventListener("change", function () {
            var img;
            var input = document.getElementById("fileLogo");
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    img = new FormData(input);
                    document.getElementById("logo").src = "" + e.target.result;
                    document.getElementById("nome").focus();
                }
                reader.readAsDataURL(input.files[0]);
            }
        });
        document.getElementById("cancelar").addEventListener("click", function () {
            document.getElementById("configuracao").style.display = "none";
        });
    }

    function desativar() {
        document.getElementById("configuracao").style.display = "none";
        document.getElementById("container").style.display = "none";
        document.getElementById("criar_orcamento").style.display = "none";
        document.getElementById("menu_cadastros").style.display = "none";
        document.getElementById("menu_pedidos").style.display = "none";
        document.getElementById("btnConfiguracao").style.display = "none";
        document.getElementById("btnConfiguracaoMobile").style.display = "none";
        document.getElementById("permissoes_users").style.display = "none";
        document.getElementById("criar_orcamento").style.display = "none";
        document.getElementById("btnSalvaOrcamento").style.display = "none";
        document.getElementById("configuracao").style.display = "none";
        document.getElementById("selectCliente").style.display = "none";
        document.getElementById("addItens").style.display = "none";
    }
    

}