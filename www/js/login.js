function initLogin() {
    var verificarEmail = false;
    var usuario = null;
    var config = null;
    var validaEmail = false;
    var produtoCliente = [];
    var produtoSelecionado = null;
    var clientes = [];
    var funcionarios = [];
    var itensOrcamento = [];
    var funcionario = null;
    var cliente = null;
    var url = "";
    var indexProduto = 0;
    var total = 0;
    var iniciou = 0;
    var alteracaoItem = false


    //Inicia a Configuração de Layout e Eventos
    function initConfiguracao() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                config = JSON.parse(this.responseText);
                if (iniciou == 0) {
                    iniciarConfiguracoes(config);
                    document.getElementById("btnConfiguracao").addEventListener("click", abrirConfiguracao); //tela de configuracao de layout
                    document.getElementById("logout").addEventListener("click", logout); //logout
                    document.getElementById("btnConfiguracaoMobile").addEventListener("click", abrirConfiguracao);//abri as configuração de cores da tela
                    document.getElementById("logoutMobile").addEventListener("click", logout); //Faz logout
                    document.getElementById("btnSalvaUsuario").addEventListener("click", salvaUsuario);// Salva o Usuario
                    document.getElementById("btnOrcaProximo").addEventListener("click", habilitaTelaItem);//FUNÇÕE DO ORCAMENTO DO FUNCIONARIO
                    document.getElementById("addItemOrca").addEventListener("click", function () {
                        addItem("qtdeProduto", "datelhe_item", false)
                    });
                    document.getElementById("addItemOrcaWeb").addEventListener("click", function () {
                        addItem("qtdeProdutoWeb", "detalheItemWeb", true)
                    });
                    document.getElementById("btnFinalizaOrcamento").addEventListener("click", mostraFormaPagamento);//Finalizar Orcamento
                    document.getElementById("btnFinalizaOrcamentoWeb").addEventListener("click", mostraFormaPagamento);//Finalizar Orcamento

                    document.getElementById("qtdeProdutoWeb").addEventListener("input", calculaProduto);
                    document.getElementById("qtdeProdutoWeb").addEventListener("keyup", addPedidoEnter);
                    document.getElementById("habilitaOrcamento").addEventListener("click", habilitaOrcamento);
                    document.getElementById("enviarOrcamento").addEventListener("click", finalizaOrcamento);
                    document.getElementById("cancelarOrcamento").addEventListener("click", questionarOrcamento);
                    document.getElementById("cancelarItem").addEventListener("click", cancelarProduto);
                    document.getElementById("simCancelaPedido").addEventListener("click", function () {
                        limparOrcamento();
                        $(".modalCancelaPedido").modal('close');
                    });
                    document.getElementById("naoCancelaPedido").addEventListener("click", function () {
                        $(".modalCancelaPedido").modal('close');
                    });
                    opcaoItem();
                    preencheClientes();
                }
                listaProdutosSolicitados();
                document.getElementById("addItensWeb").style.display = "none";
                document.getElementById("informatacaoCliente").style.display = "none";
                document.getElementById("resumoVendedor").value = usuario.nome.toUpperCase();

                checarTipoUsuario();
                consultaPermissoes();
                $('#modalpreload').modal('close');
                iniciou = 1;
            }
        }


        request.open("POST", url + "php/configuracao.php", true);
        request.send();
    }

    function listaProdutosSolicitados() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                var result = JSON.parse(request.responseText);
                var produtos = [];
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].itens.length; j++) {
                        var verifica = false;
                        for (var k = 0; k < produtos.length; k++) {
                            if (result[i].itens[j].PRO_PKN_CODIGO == produtos[k].codigo) {
                                produtos[k].qtde = parseInt(produtos[k].qtde) + parseInt(result[i].itens[j].NET_ITEM_QTD);
                                if (produtos[k].orcamentos.indexOf(result[i]) <= -1) {
                                    produtos[k].orcamentos.push(result[i]);
                                }

                                verifica = true;
                            }
                        }
                        if (verifica == false) {
                            produtos.push(
                                {
                                    codigo: result[i].itens[j].PRO_PKN_CODIGO,
                                    descricao: result[i].itens[j].descricao,
                                    qtde: parseInt(result[i].itens[j].NET_ITEM_QTD),
                                    orcamentos: [result[i]]
                                });
                        }
                    }
                }
                produtos.sort(function (a, b) {
                    return a.qtde > b.qtde ? -1 : a.qtde < b.qtde ? 1 : 0;
                });
                var select = "";
                var qtdeAcumulada = 0;
                for (var i = 0; i < produtos.length; i++) {
                    select += '    <a class="collection-item itemacumulado" id="' + i + '">' +
                        '<span class="badge">' + produtos[i].qtde + '</span>' +
                        '' + produtos[i].descricao.substring(0, 35) + '</a>';
                    qtdeAcumulada += produtos[i].qtde;
                }
                document.getElementById("preloadItens").style.display = "none";
                document.getElementById("produtos").innerHTML = select;
                document.getElementById("qtdeItemAcumulado").value = qtdeAcumulada;

                for (var i = 0; i < produtos.length; i++) {
                    document.getElementsByClassName("itemacumulado")[i].removeEventListener("click", function () {
                    });
                    document.getElementsByClassName("itemacumulado")[i].addEventListener("click", function () {
                        var pedidos = "";
                        var zebra = true;
                        for (var j = 0; j < produtos[this.id].orcamentos.length; j++) {
                            var orcamento = produtos[this.id].orcamentos[j];
                            for (var k = 0; k < orcamento.itens.length; k++) {
                                if (produtos[this.id].codigo == orcamento.itens[k].PRO_PKN_CODIGO) {
                                    pedidos += '<div class="row zebra">';
                                    pedidos += '<div class="col s12 m6 l6 subtitleitem"><div class="col s1 m2 l2">' + orcamento.NET_PKN_SEQUENCIAL + '</div>';
                                    pedidos += '<div class="col s11 m10 l10">' + orcamento.NET_A_CLI_NOME.substring(0, 35) + '</div></div>';
                                    pedidos += '<div class="col s12 m6 l6 subdetalheitem"><div class="col s9 m10 l10">' + orcamento.itens[k].descricao + '</div>';
                                    pedidos += '<div class="col s1 m1 l1">' + orcamento.itens[k].NET_ITEM_QTD + '</div></div>';
                                    pedidos += '</div>';
                                    zebra = !zebra;
                                }
                            }
                        }
                        document.getElementById("itemPedido").innerHTML = pedidos;
                        $('.modalItemOrcamentos').modal();
                        $('.modalItemOrcamentos').modal('open');
                    });
                }
            }
        }
        request.open("POST", url + "php/getOrcamentos.php", true);
        request.send();
    }

    function questionarOrcamento() {
        $(".modalCancelaPedido").modal();
        $(".modalCancelaPedido").modal('open');
    }

    function habilitaOrcamento() {
        if (cliente != null) {
            document.getElementById("selectCliente").style.display = "none";
            document.getElementById("informatacaoCliente").style.display = "block";
            document.getElementById("addItensWeb").style.display = "block";
            document.getElementById("infoNome").innerHTML = "RAZAO SOCIAL: " + cliente.PAR_A_RAZAOSOCIAL;
            document.getElementById("infoCpfCnpj").innerHTML = "CNPJ/CPF: " + cliente.PAR_A_CNPJ_CPF;
            document.getElementById("infoEndereco").innerHTML = "ENDERECO: " + cliente.PAR_A_LOGRADOURO + " " + cliente.PAR_A_ENDERECO + " " + cliente.PAR_A_NUMERO;
            selectProdutoCliente(cliente, "autocompleteproduto", "precoProdutoWeb", "unidadeProdutoWeb", "dialogProduto");
            document.getElementById("autocompleteproduto").focus();
        }
    }

    function mostraFormaPagamento() {
        if (cliente == null) {
            Materialize.toast('CLIENTE DEVE SER SELECIONADO', 5000);
            return;
        }
        if (itensOrcamento.length == 0) {
            Materialize.toast('ADICIONE PELO MENOS UM ITEM NO ORCAMENTO', 5000);
            return;
        }
        $('#modalpreload').modal('open');
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                var forma = JSON.parse(request.responseText);
                var options = "<option value='' disabled selected >SELECIONE A FORMA DE PAGAMENTO</option>";
                for (var i = 0; i < forma.length; i++) {
                    options += '<option value="' + forma[i].FOR_PKN_CODIGO + '">' + forma[i].FOR_A_DESCRICAO + '</option>';
                }
                document.getElementById("selectFormaPagamento").innerHTML = options;
                $('#modalpreload').modal('close');
                $('#modalFormaPagamento').modal({dismissible: true});
                $('#modalFormaPagamento').modal('open');
                $('select').material_select();
            }
        }
        request.open("GET", url + "php/formaPagamento.php?id=" + cliente.PAR_PKN_CODIGO, true);
        request.send();
    }

    function iniciarConfiguracoes(config) {
        document.getElementById("menu_painel").style.background = config.cor_menu;
        document.getElementById("conteudo_painel").style.background = config.cor_conteudo;
        document.getElementById("container").style.background = config.cor_fundo;
        document.getElementsByTagName("body")[0].style.background = config.cor_fundo;
        document.getElementById("logo").src = "assets/icon/" + config.logo;
        document.title = config.nome_empresa;
    }

    function checarTipoUsuario() {
        $("#tipoUsuario").change(function () {
            document.getElementById("dadosUser").style.display = "block";
            if (document.getElementById("tipoUsuario").value == 2 || document.getElementById("tipoUsuario").value == 3) {
                preencheAutoFuncionario();
                document.getElementById("autofuncionario").style.display = "block";
                document.getElementById("autocomcliente").style.display = "none";
            } else {
                ;
                preencheAutoCliente();
                document.getElementById("autocomcliente").style.display = "block";
                document.getElementById("autofuncionario").style.display = "none";
            }

        });
    }

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
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                    document.getElementById("progress").style.display = "block";
                    if (this.responseText != "0") {
                        usuario = JSON.parse(this.responseText);
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
                }
            }
            request.open("POST", url + "php/consultaEmail.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("email=" + email);
        } else {
            document.getElementById("email").focus();
            document.getElementById("lEmail").setAttribute("data-error", "E-mail Invalido");
            document.getElementById("email").setAttribute("class", "validate invalid");

        }
    }

    function habilitaPedido() {
        if (usuario.tipo == "GERENTE") {
            document.getElementById("criar_orcamento").style.display = "block";
        } else if (usuario.tipo == "FUNCIONARIO") {
            document.getElementById("funcionario_orcamento").style.display = "block";
            document.getElementById("selectCliente").style.display = "block";
        }
        document.getElementById("todosOrcamento").style.display = "none";
        preencheClientes();
    }

    function verificaEmailCadastro() {
        var email = document.getElementById("emailUser").value;
        if (email.indexOf("@") >= 0 && email.indexOf(".com") >= 0) {
            var request = new XMLHttpRequest();
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.onreadystatechange = function () {
                if (response != "0") {
                    document.getElementById("emailUser").focus();
                    document.getElementById("lEmailUser").setAttribute("data-error", "E-mail já possui cadastro");
                    document.getElementById("emailUser").setAttribute("class", "validate invalid");
                    validaEmail = false;
                } else {
                    validaEmail = true;
                }
            }
            request.open("POST", url + "php/consultaEmail.php", true);
            request.send("email=" + email);
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
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                verificaLogin();
                console.log("Sessao Iniciada");
            }
        }
        xmlhttp.open("GET", url + "php/startSession.php?idusuario=" + usuario.idlogin + "&conexao=" + conectado, true);
        xmlhttp.send();
    }

//verifica se o usuario esta logado
    function verificaLogin() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                usuario = JSON.parse(this.responseText);
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
                    document.getElementById("containerLogin").style.display = "block";
                    verificarEmail = false;
                    document.getElementById("email").addEventListener("keypress", function () {
                        if (event.keyCode == 13) login();
                    });
                    document.getElementById("password").addEventListener("keypress", function () {
                        if (event.keyCode == 13) login();
                    });
                    document.getElementById("logar").addEventListener("click", login);
                }
            }
        };
        xmlhttp.open("POST", url + "php/checkSession.php", true);
        xmlhttp.send();
    }

//logout
    function logout() {
        $('.button-collapse').sideNav('hide');
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                desativar();
                verificaLogin();
                console.log("Verificando Login");
            }
        }
        request.open("POST", url + "php/logout.php", true);
        request.send();
    }

// Tela de adicionar item
    function habilitaTelaItem() {
        if (cliente != null) {
            document.getElementById("selectCliente").style.display = "none";
            document.getElementById("addItens").style.display = "block";
            //document.getElementById("informatacaoCliente").style.display = "block";
            document.getElementById("infoNome").innerHTML = "RAZAO SOCIAL: " + cliente.PAR_A_RAZAOSOCIAL;
            document.getElementById("infoCpfCnpj").innerHTML = "CNPJ/CPF: " + cliente.PAR_A_CNPJ_CPF;
            document.getElementById("infoEndereco").innerHTML = "ENDERECO: " + cliente.PAR_A_LOGRADOURO + " " + cliente.PAR_A_ENDERECO + " " + cliente.PAR_A_NUMERO;
            selectProdutoCliente(cliente, "produto_orcamento", "precoProduto", "unidadeProduto", "dlgproduto");
        } else {
            Materialize.Toast.removeAll();
            Materialize.toast('Por favor selecione o cliente', 4000);
        }
    }

// Adicionar Item na lista
    function addItem(campoQuantidade, idtabela, web) {
        Materialize.Toast.removeAll();
        var item = new Object();
        item.produto = produtoSelecionado;
        item.qtde = parseFloat(document.getElementById(campoQuantidade).value);
        if (produtoSelecionado == null) {
            Materialize.toast('PRODUTO DEVE SER SELECIONADO', 5000);
            document.getElementById("produto_orcamento").focus();
            return;
        }
        if (item.qtde == 0 || Number.isNaN(item.qtde)) {
            Materialize.toast('INFORME A QUANTIDADE', 5000);
            document.getElementById("qtdeProduto").focus();
            return;
        }
        if (item.produto != null) {
            item.total = item.produto.valor * item.qtde;
            if (alteracaoItem == true) {
                //CHECA SE O ITEM JÁ EXISTE
                for (var i = 0; i < itensOrcamento.length; i++) {
                    if (i == indexProduto) {
                        itensOrcamento[i] = item;
                    }
                    total = total + itensOrcamento[i].total;
                }
            }
            if (alteracaoItem == false) {
                total = total + item.total;
                itensOrcamento.push(item);
            }
            atualizaLista(idtabela, web);
            alteracaoItem = false;

            if (web == false) {
                document.getElementById("totalOrcamento").value = numberToReal(total);
                document.getElementById("precoProduto").value = "";
                document.getElementById("produto_orcamento").value = "";
                document.getElementById("qtdeProduto").value = "";
                document.getElementById("unidadeProduto").value = "";
            } else {
                cancelarProduto();
            }

            $("#modalSelecionaProduto").modal("close");
            produtoSelecionado = null;
        }
    }

    function cancelarProduto() {
        document.getElementById("precoProdutoWeb").value = "";
        document.getElementById("qtdeProdutoWeb").value = "";
        document.getElementById("unidadeProdutoWeb").value = "";
        document.getElementById("autocompleteproduto").value = "";
        document.getElementById("autocompleteproduto").focus();
        document.getElementById("totalProdutoWeb").value = "";
        document.getElementById("resumoQtdeItem").value = itensOrcamento.length;
        document.getElementById("resumotTotalItens").value = "R$:" + numberToReal(total);
        document.getElementById("autocompleteproduto").setAttribute("style", "background-color:#fff");
        document.getElementById("autocompleteproduto").style.color = "#000";
        document.getElementById("addItemOrcaWeb").innerHTML = "ADICIONAR";
        document.getElementById("autocompleteproduto").disabled = false;
        alteracaoItem = false;
    }


    function atualizaLista(tabela, web) {
        var itens = "";
        var itensWeb = "";
        var acumulaUnidade = [];
        total = 0;
        for (var i = 0; i < itensOrcamento.length; i++) {
            var item = itensOrcamento[i];
            itens += "<li style='border:1px solid #5f5c5c' class='itemCliente' id='" + i + "'>";
            itens += '<div class="row">';
            itens += '<div class="col s12" id="descricaoitem">' + item.produto.descricao.toUpperCase() + '</div>';
            itens += '<div class="col s12" id="subdescricaoitem">';
            itens += '<div class="col s4">' + item.qtde + '</div>';
            itens += '<div class="col s4">' + numberToReal(item.produto.valor) + '</div>';
            itens += '<div class="col s4">' + numberToReal(itensOrcamento[i].total) + '</div>';
            itens += '</div>';
            itens += '</div>';
            itens += '</li>';

            itensWeb += "<li style='border:1px solid #5f5c5c' class='itemCliente' id='" + item.produto.idproduto + "'>";
            itensWeb += '<div class="row" id="descricaoitem">';
            itensWeb += '<div class="col s1" >' + item.produto.idproduto + '</div>';
            itensWeb += '<div class="col s4" >' + item.produto.descricao.toUpperCase() + '</div>';
            itensWeb += '<div class="col s1">' + item.produto.unidade + '</div>';
            itensWeb += '<div class="col s1">' + item.qtde + '</div>';
            itensWeb += '<div class="col s1">' + numberToReal(item.produto.valor) + '</div>';
            itensWeb += '<div class="col s2">' + numberToReal(itensOrcamento[i].total) + '</div>';
            itensWeb += '<div class="col s1"><a class="apagaritem" id="' + i + '"><i class="material-icons ">close</i></a></div>';
            itensWeb += '<div class="col s1"><a class="edititem" id="' + i + '"><i class="material-icons ">edit</i></a></div>';
            itensWeb += '</div>';
            itensWeb += '</li>';

            total += itensOrcamento[i].total;

            var existe = false;
            for (var j = 0; j < acumulaUnidade.length; j++) {
                if (acumulaUnidade[j].unidade == item.produto.unidade) {
                    acumulaUnidade[j].qtde += item.qtde;
                    existe = true;
                    break;
                }
            }
            if (existe == false) {
                var objeto = new Object();
                objeto.unidade = item.produto.unidade;
                objeto.qtde = item.qtde;
                acumulaUnidade.push(objeto);
            }
        }
        document.getElementById("resumoQtdeItem").value = itensOrcamento.length;
        document.getElementById("resumotTotalItens").value = numberToReal(total);
        document.getElementById("totalOrcamento").value = numberToReal(total);
        document.getElementById("datelhe_item").innerHTML = itens;
        document.getElementById("detalheItemWeb").innerHTML = itensWeb;
        var acumulador = "";
        for (var i = 0; i < acumulaUnidade.length; i++) {
            acumulador += "<li class='collection-item'>" + acumulaUnidade[i].unidade + " : " + acumulaUnidade[i].qtde + "</li>";
        }
        document.getElementById("resumoQtdeKgItem").innerHTML = acumulador;
        eventItem();
        eventItemWeb();
    }

    function eventItemWeb() {
        var elems = document.getElementsByClassName("apagaritem"), i;
        for (i = 0; i < elems.length; i++) {
            document.getElementsByClassName("apagaritem")[i].removeEventListener("click", function () {
            });
            document.getElementsByClassName("apagaritem")[i].addEventListener("click", function () {
                for (var j = 0; j < itensOrcamento.length; j++) {
                    if (j == this.id) {
                        indexProduto = j;
                        break;
                    }
                }
                itensOrcamento.splice(indexProduto, 1);
                atualizaLista("detalheItemWeb", true);
            });

            document.getElementsByClassName("edititem")[i].removeEventListener("click", function () {
            });
            document.getElementsByClassName("edititem")[i].addEventListener("click", function () {
                for (var j = 0; j < itensOrcamento.length; j++) {
                    if (j == this.id) {
                        indexProduto = j;
                        break;
                    }
                }
                modificarItem();
            });
        }
    }

    function modificarItem() {
        produtoSelecionado = itensOrcamento[indexProduto].produto;
        document.getElementById("dialogProduto").style.display = "none";
        document.getElementById("autocompleteproduto").setAttribute("style", "background-color:#c0c0c0");
        document.getElementById("autocompleteproduto").style.color = "#000";
        document.getElementById("addItemOrcaWeb").innerHTML = "ALTERAR";
        document.getElementById("autocompleteproduto").setAttribute("disabled", "true");
        document.getElementById("autocompleteproduto").value = produtoSelecionado.descricao.toUpperCase();
        document.getElementById("precoProdutoWeb").value = numberToReal(produtoSelecionado.valor);
        document.getElementById("unidadeProdutoWeb").value = produtoSelecionado.unidade.toString();
        document.getElementById("qtdeProdutoWeb").focus();
        alteracaoItem = true;
    }

    function eventItem() {
        //Habilita Opções quando clicar no item
        var elems = document.getElementsByClassName("itemCliente"), i;
        for (i = 0; i < elems.length; i++) {
            document.getElementsByClassName("itemCliente")[i].removeEventListener("click", function () {
            });
            document.getElementsByClassName("itemCliente")[i].addEventListener("click", function () {
                for (var j = 0; j < itensOrcamento.length; j++) {
                    if (j == this.id) {
                        indexProduto = j;
                        break;
                    }
                }
                var descricao = itensOrcamento[indexProduto].produto.descricao;
                document.getElementById("nomeProduto").innerHTML = "PRODUTO: " + descricao;
                $("#opcaoItem").modal();
                $("#opcaoItem").modal('open');
            });
        }
    }

    function opcaoItem() {
        document.getElementById("excluirItem").addEventListener("click", function () {
            itensOrcamento.splice(indexProduto, 1);
            atualizaLista("datelhe_item", false);
            $("#opcaoItem").modal("close");
        });
        document.getElementById("alteraItem").addEventListener("click", function () {
            $("#opcaoItem").modal("close");
            item = itensOrcamento[indexProduto];
            produtoSelecionado = item.produto;
            document.getElementById("produto_orcamento").value = produtoSelecionado.descricao;
            document.getElementById("qtdeProduto").value = item.qtde;
            document.getElementById("precoProduto").value = numberToReal(produtoSelecionado.valor);
            document.getElementById("unidadeProduto").value = produtoSelecionado.unidade.toString();
            $("#modalSelecionaProduto").modal('open');
            alteracaoItem = true;
        });
    }

    function finalizaOrcamento() {
        if (document.getElementById("selectFormaPagamento").value == '') {
            Materialize.toast('SELECIONE UMA FORMA DE PAGAMENTO', 5000);
            return;
        }
        $("#modalFormaPagamento").modal("close");
        if (cliente == null) {
            Materialize.toast('CLIENTE DEVE SER SELECIONADO', 5000);
            return;
        }
        if (itensOrcamento.length == 0) {
            Materialize.toast('ADICIONE PELO MENOS UM ITEM NO ORCAMENTO', 5000);
            return;
        }
        $('#modalpreload').modal('open');
        console.log(usuario.codfuncionario);
        var orcamento = new Object();
        orcamento.forma = $("#selectFormaPagamento").val();
        orcamento.usuario = cliente;
        orcamento.funcionario = usuario.codfuncionario;
        orcamento.total = parseFloat(total);
        orcamento.itens = itensOrcamento;
        var dado = JSON.stringify(orcamento);
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                limparOrcamento();
                $('#modalpreload').modal('close');
                $('#modalInfo').modal('open');
            }
        }
        request.open("POST", url + "php/salvaOrcamento.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("dado=" + dado);

    }

    function limparOrcamento() {
        itensOrcamento = [];
        total = 0;
        document.getElementById("totalOrcamento").value = "0,00";
        document.getElementById("autocomplete-fantasia").value = "";
        document.getElementById("cpfcnpj").value = "";
        document.getElementById("totalOrcamento").value = "0,00";
        document.getElementById("qtdeProduto").value = "";
        document.getElementById("titleModal").innerHTML = "";
        document.getElementById("msgModal").innerHTML = "Orcamento enviado com sucesso";
        document.getElementById("selectCliente").style.display = "block";
        document.getElementById("addItens").style.display = "none";
        document.getElementById("menu_painel").style.display = "block";
        document.getElementById("datelhe_item").innerHTML = "";
        document.getElementById("detalheItemWeb").innerHTML = "";
        document.getElementById("resumoQtdeItem").value = "0";
        document.getElementById("resumoQtdeKgItem").innerHTML = " ";
        document.getElementById("resumotTotalItens").value = "R$: 0,00";
        document.getElementById("endereco").value = "";
        document.getElementById("addItensWeb").style.display = "none";
        document.getElementById("informatacaoCliente").style.display = "none";
        document.getElementById("autocompletecliente").value = "";
        document.getElementById("autocompletecliente").focus();
        document.getElementById("precoProdutoWeb").value = "";
        document.getElementById("qtdeProdutoWeb").value = "";
        document.getElementById("unidadeProdutoWeb").value = "";
        document.getElementById("autocompleteproduto").value = "";
        document.getElementById("autocompleteproduto").focus();
        document.getElementById("totalProdutoWeb").value = "";
        document.getElementById("resumoQtdeItem").value = itensOrcamento.length;
        document.getElementById("resumotTotalItens").value = "R$:" + numberToReal(total);
    }

//Salva o usuario
    function salvaUsuario() {
        if (cliente == null && funcionario == null) {
            Materialize.toast('Selecione um usuario', 4000);
            return;
        }
        var img = document.getElementById("file");
        var file_data = img.files[0];
        var form_data = new FormData();
        if (verificaNovoEmail(document.getElementById('emailUserNovo').value) == false) {
            return;
        }
        // form_data.append('file', file_data);
        form_data.append('email', document.getElementById('emailUserNovo').value);
        form_data.append('senha', document.getElementById('senhaUserNovo').value);
        form_data.append('permissao', document.getElementById('tipoUsuario').value);

        if (document.getElementById("tipoUsuario").value == 2 || document.getElementById("tipoUsuario").value == 3) {
            form_data.append('nome', funcionario.FUN_A_NOME);
            form_data.append('codusuario', funcionario.FUN_PKN_CODIGO);
        }
        if (cliente != null) {
            form_data.append('nome', cliente.PAR_A_RAZAOSOCIAL);
            form_data.append('codusuario', cliente.PAR_PKN_CODIGO);
        }
        $('#modalpreload').modal('open');
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                document.getElementById("autocompletefuncionario").value = "";
                document.getElementById("autocliente").value = "";
                document.getElementById('emailUserNovo').value = "";
                document.getElementById('senhaUserNovo').value = "";
                document.getElementById("titleModal").innerHTML = "";
                document.getElementById("msgModal").innerHTML = "Usuario salvo com sucesso";
                document.getElementById("dadosUser").style.display = "none";
                $('#modalpreload').modal('close');
                $('#modalInfo').modal('open');
                cliente = null;
                funcionario = null;
            }
        }
        request.open("POST", url + "php/salvaUsuario.php");
        request.send(form_data);
    }

    function incluirPainel() {
        document.getElementById("container").style.display = "block";
        //INICIA FUNÇÕES DO MATERIALIZE
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

        if (usuario.idpermissao == 1 || usuario.idpermissao == 2) {
            document.getElementById("tabs-menu").style.display = "block"
            $('ul.tabs').tabs('select_tab', 'home');
            document.getElementById("funcionario_orcamento").style.display = "block";
            document.getElementById("selectCliente").style.display = "block";
            document.getElementById("menu_cadastros").style.display = "block";
            document.getElementById("menu_pedidos").style.display = "block";
            document.getElementById("btnConfiguracao").style.display = "block";
            document.getElementById("btnConfiguracaoMobile").style.display = "block";

        }
        if (usuario.idpermissao == 3) {
            document.getElementById("tabs-menu").style.display = "none";
            $('ul.tabs').tabs('select_tab', 'pedidos');
            document.getElementById("funcionario_orcamento").style.display = "block";
            document.getElementById("selectCliente").style.display = "block";
            document.getElementById("btnConfiguracao").style.display = "none";
            document.getElementById("btnConfiguracaoMobile").style.display = "none";
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

//Incluir os produtos do cliente dentro do select
    function selectProdutoCliente(cliente, autocompete, preco, unidade, dialog) {
        $('#modalpreload').modal('open');
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                produtoCliente = JSON.parse(this.responseText);
                console.log(autocompete);
                var qtde = 0;
                document.getElementById(autocompete).removeEventListener("input", function () {
                });
                document.getElementById(autocompete).addEventListener("input", function () {
                    qtde = 0;
                    this.value = this.value.toUpperCase();
                    var select = "";
                    var str = document.getElementById(autocompete).value;
                    for (var i = 0; i < produtoCliente.length; i++) {
                        if (produtoCliente[i].descricao.toUpperCase().startsWith(str.toUpperCase())) {
                            select += '<div class="selecionaProduto" id="' + i + '">' + produtoCliente[i].descricao.toUpperCase() + '</div>';
                            qtde++;
                        }
                    }
                    console.log(dialog);
                    document.getElementById(dialog).innerHTML = select;
                    if (qtde > 0) {
                        document.getElementById(dialog).style.display = "block";
                    } else {
                        document.getElementById(dialog).style.display = "none";
                    }
                    var elems = document.getElementsByClassName("selecionaProduto"), i;
                    for (i = 0; i < elems.length; i++) {
                        document.getElementsByClassName("selecionaProduto")[i].removeEventListener("click", function () {
                        });
                        document.getElementsByClassName("selecionaProduto")[i].addEventListener("click", function () {
                            document.getElementById(dialog).style.display = "none";
                            produtoSelecionado = produtoCliente[this.id];
                            document.getElementById(autocompete).value = produtoSelecionado.descricao.toUpperCase();
                            document.getElementById(preco).value = numberToReal(produtoSelecionado.valor);
                            document.getElementById(unidade).value = produtoSelecionado.unidade.toString();
                            document.getElementById("qtdeProdutoWeb").focus();
                            if (autocompete == "produto_orcamento") {
                                document.getElementById("descricaoProduto").value = produtoSelecionado.descricao.toUpperCase();
                                $('#modalSelecionaProduto').modal('open');
                            }
                        });
                    }
                });
                document.getElementById(autocompete).addEventListener("keypress", function (e) {
                    if (e.keyCode == 13) {
                        if (document.getElementById(autocompete).value === '') {
                            Materialize.toast('INFORME A DESCRICÃO OU CODIGO DO PRODUTO!', 5000);
                            document.getElementById("autocompleteproduto").value = "";
                            document.getElementById("autocompleteproduto").focus();
                            return;
                        }
                        var codigo = parseInt(document.getElementById(autocompete).value);
                        for (var i = 0; i < produtoCliente.length; i++) {
                            if (produtoCliente[i].idproduto == codigo) {
                                produtoSelecionado = produtoCliente[i];
                                document.getElementById(dialog).style.display = "none";
                                document.getElementById("autocompleteproduto").value = produtoCliente[i].descricao.toUpperCase();
                                document.getElementById(preco).value = numberToReal(produtoCliente[i].valor);
                                document.getElementById(unidade).value = produtoCliente[i].unidade.toString();
                                document.getElementById("qtdeProdutoWeb").focus();
                                break;
                            }
                        }

                        if (produtoSelecionado == null) {
                            Materialize.toast('PRODUTO NÃO ENCONTRADO!', 5000);
                            document.getElementById("autocompleteproduto").value = "";
                            document.getElementById("autocompleteproduto").focus();
                        }
                    }
                });

                $('#modalpreload').modal('close');
            }
        }
        request.open("POST", url + "php/getProdutosCliente.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("codigo=" + cliente.TAB_PKN_CODIGO);
    }

    function calculaProduto() {
        var tecla = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (tecla == 13) {
            addItem("qtdeProdutoWeb", "detalheItemWeb");
        }
    }

    function addPedidoEnter(event) {
        if (produtoSelecionado != null) {
            document.getElementById("totalProdutoWeb").value = numberToReal(produtoSelecionado.valor * parseFloat(this.value));
            var tecla = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
            if (tecla == 13) {
                addItem("qtdeProdutoWeb", "detalheItemWeb");
            }
        }
    }

//tras todos os orcamentos do cliente
    function listaOrcamentos() {
        document.getElementById("todosOrcamento").style.display = "block";
        document.getElementById("criar_orcamento").style.display = "none";
        document.getElementById("funcionario_orcamento").style.display = "none";
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
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
        }
        request.open("POST", url + "php/getOrcamentos.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send();
    }

//preenche o select com os clientes
    function preencheClientes() {
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                cliente = [];
                clientes = JSON.parse(this.responseText);
                var qtde = 0;
                document.getElementById("autocompletecliente").addEventListener("input", function () {
                    this.value = this.value.toUpperCase();
                    var select = "";
                    var str = document.getElementById("autocompletecliente").value;
                    qtde = 0;
                    for (var i = 0; i < clientes.length; i++) {
                        if (clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase().startsWith(str.toUpperCase())) {
                            select += '<div class="selecionaCliente" id="' + i + '">' + clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase() + '</div>';
                            qtde++;
                        }

                    }
                    document.getElementById("dialogcliente").innerHTML = select;
                    if (qtde > 0) {
                        document.getElementById("dialogcliente").style.display = "block";
                    } else {
                        document.getElementById("dialogcliente").style.display = "none";
                    }
                    var elems = document.getElementsByClassName("selecionaCliente"), i;
                    for (i = 0; i < elems.length; i++) {
                        document.getElementsByClassName("selecionaCliente")[i].removeEventListener("click", function () {
                        });
                        document.getElementsByClassName("selecionaCliente")[i].addEventListener("click", function () {
                            document.getElementById("dialogcliente").style.display = "none";
                            limparOrcamento();
                            cliente = clientes[this.id];
                            document.getElementById("autocomplete-fantasia").value = cliente.PAR_A_NOME_FANTASIA;
                            document.getElementById("cpfcnpj").placeholder = " ";
                            document.getElementById("cpfcnpj").value = cliente.PAR_A_CNPJ_CPF;
                            document.getElementById("autocompletecliente").value = this.innerHTML;
                            document.getElementById("endereco").value = cliente.PAR_A_LOGRADOURO + " " + cliente.PAR_A_ENDERECO + " " + cliente.PAR_A_NUMERO;
                        });
                    }
                });
            }
        }
        request.open("POST", url + "php/getClientes.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send();
    }

    function preencheAutoFuncionario() {
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                funcionarios = [];
                funcionarios = JSON.parse(this.responseText);
                var qtde = 0;
                document.getElementById("autocompletefuncionario").addEventListener("input", function () {
                    this.value = this.value.toUpperCase();
                    var select = "";
                    var str = document.getElementById("autocompletefuncionario").value;
                    qtde = 0;
                    for (var i = 0; i < funcionarios.length; i++) {
                        if (funcionarios[i].FUN_A_NOME.toUpperCase().startsWith(str.toUpperCase())) {
                            select += '<div class="selecionaFuncionario" id="' + i + '">' + funcionarios[i].FUN_A_NOME.toUpperCase() + '</div>';
                            qtde++;
                        }

                    }
                    document.getElementById("dialogfuncionario").innerHTML = select;
                    if (qtde > 0) {
                        document.getElementById("dialogfuncionario").style.display = "block";
                    } else {
                        document.getElementById("dialogfuncionario").style.display = "none";
                    }
                    var elems = document.getElementsByClassName("selecionaFuncionario"), i;
                    for (i = 0; i < elems.length; i++) {
                        document.getElementsByClassName("selecionaFuncionario")[i].removeEventListener("click", function () {
                        });
                        document.getElementsByClassName("selecionaFuncionario")[i].addEventListener("click", function () {
                            document.getElementById("dialogfuncionario").style.display = "none";
                            funcionario = funcionarios[this.id];
                            document.getElementById("autocompletefuncionario").value = funcionario.FUN_A_NOME;
                        });
                    }
                });
                document.getElementById("autocompletefuncionario").addEventListener("blur", function () {
                    setTimeout(function () {
                        document.getElementById("dialogfuncionario").style.display = "none";
                    }, 200);
                });
            }
        }
        request.open("POST", url + "php/getFuncionarios.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send();
    }

    function preencheAutoCliente() {
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                cliente = [];
                clientes = JSON.parse(this.responseText);
                var qtde = 0;
                document.getElementById("autocliente").addEventListener("input", function () {
                    this.value = this.value.toUpperCase();
                    var select = "";
                    var str = document.getElementById("autocliente").value;
                    qtde = 0;
                    for (var i = 0; i < clientes.length; i++) {
                        if (clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase().startsWith(str.toUpperCase())) {
                            select += '<div class="selecionaNovoCliente" id="' + i + '">' + clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase() + '</div>';
                            qtde++;
                        }

                    }
                    document.getElementById("dialogclientenovo").innerHTML = select;
                    if (qtde > 0) {
                        document.getElementById("dialogclientenovo").style.display = "block";
                    } else {
                        document.getElementById("dialogclientenovo").style.display = "none";
                    }
                    var elems = document.getElementsByClassName("selecionaNovoCliente"), i;
                    for (i = 0; i < elems.length; i++) {
                        document.getElementsByClassName("selecionaNovoCliente")[i].removeEventListener("click", function () {
                        });
                        document.getElementsByClassName("selecionaNovoCliente")[i].addEventListener("click", function () {
                            document.getElementById("dialogclientenovo").style.display = "none";
                            limparOrcamento();
                            cliente = clientes[this.id];
                            document.getElementById("autocliente").value = this.innerHTML;
                        });
                    }
                });
            }
        }
        request.open("POST", url + "php/getClientes.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send();
    }

//Habilitar a tela de configuração de layout do usuario
    function abrirConfiguracao() {
        $('.button-collapse').sideNav('hide');
        document.getElementById("configuracao").style.display = "block";
        document.getElementById("cor_menu").value = config.cor_menu;
        document.getElementById("cor_fundo").value = config.cor_fundo;
        document.getElementById("cor_conteudo").value = config.cor_conteudo;
        document.getElementById("nome_empresa").value = config.nome_empresa;
        document.getElementById("cor_menu").addEventListener("change", mudarCorElemento("menu_painel", "cor_menu"));
        document.getElementById("cor_conteudo").addEventListener("change", mudarCorElemento("conteudo_pa-fundo", "cor_fundo"));
        document.getElementById("cor_fundo").addEventListener("change", mudarCorElemento("container", "cor"));
        document.getElementById("btnSalvaConfig").addEventListener("click", function () {
            var file_data = document.getElementById("fileLogo").files[0];
            var form_data = new FormData();
            form_data.append('file', file_data);
            form_data.append('cor_fundo', document.getElementById("cor_fundo").value);
            form_data.append('cor_conteudo', document.getElementById("cor_conteudo").value);
            form_data.append('cor_menu', document.getElementById("cor_menu").value);
            form_data.append('nome_empresa', document.getElementById("nome_empresa").value);
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("configuracao").style.display = "none";
                    document.title = document.getElementById("nome_empresa").value;
                }
            }
            request.open("POST", url + "php/salvaConfiguracao.php");
            request.send(form_data);
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

    function mudarCorElemento(nomeElemento, inputColor) {
        document.getElementById(nomeElemento).style.background = document.getElementById(inputColor).value;
    }

    function desativar() {
        document.getElementById("configuracao").style.display = "none";
        document.getElementById("container").style.display = "none";
        document.getElementById("menu_cadastros").style.display = "none";
        document.getElementById("menu_pedidos").style.display = "none";
        document.getElementById("btnConfiguracao").style.display = "none";
        document.getElementById("btnConfiguracaoMobile").style.display = "none";
        document.getElementById("configuracao").style.display = "none";
        document.getElementById("selectCliente").style.display = "none";
        document.getElementById("addItens").style.display = "none";
        document.getElementById("totalOrcamento").value = numberToReal(total);
        document.getElementById("precoProduto").value = "";
        document.getElementById("produto_orcamento").value = "";
        document.getElementById("qtdeProduto").value = "";
        document.getElementById("unidadeProduto").value = "";
        document.getElementById("precoProdutoWeb").value = "";
        document.getElementById("qtdeProdutoWeb").value = "";
        document.getElementById("unidadeProdutoWeb").value = "";
        document.getElementById("autocompleteproduto").value = "";
        document.getElementById("autocompleteproduto").focus();
        document.getElementById("totalProdutoWeb").value = "";
        document.getElementById("resumoQtdeItem").value = itensOrcamento.length;
        document.getElementById("resumotTotalItens").value = "R$:" + numberToReal(total);

        limparOrcamento();
    }
}

window.onbeforeunload = function () {
    return "Os dados do formulário serão perdidos.";
}