document.addEventListener("DOMContentLoaded", function (event) {
    var verificarEmail = false;
    var usuario = null;
    var config = null;
    var validaEmail = false;
    var produtoCliente = [];
    var produtoSelecionado = null;
    var clientes = [];
    var funcionarios = [];
    var orcamentos = [];
    var orcamento = null;
    var itensOrcamento = [];
    var funcionario = null;
    var cliente = null;
    var url = "";
    var indexProduto = 0;
    var total = 0;
    var iniciou = 0;
    var alteracaoItem = false;

    verificaLogin();


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
                    document.getElementById("cancelaAddItem").addEventListener("click", function () {
                        document.getElementById("submenu").style.display = "block";
                    });
                    document.getElementById("addItem").addEventListener("click", function () {
                        document.getElementById("submenu").style.display = "none";
                        $('#modalSelecionaProduto').modal('open');
                        document.getElementById("produto_orcamento").focus();
                    });
                    document.getElementById("addItemOrca").addEventListener("click", function () {
                        addItem("qtdeProduto", "datelhe_item", false)
                    });
                    document.getElementById("addItemOrcaWeb").addEventListener("click", function () {
                        addItem("qtdeProdutoWeb", "detalheItemWeb", true)
                    });
                    document.getElementById("excluirPedido").addEventListener("click", excluirPedido);
                    document.getElementById("btnFinalizaOrcamento").addEventListener("click", mostraFormaPagamento);//Finalizar Orcamento
                    document.getElementById("btnFinalizaOrcamentoWeb").addEventListener("click", mostraFormaPagamento);//Finalizar Orcamento
                    document.getElementById("btnAlteraOrcamento").addEventListener("click", alterarOrcamento);
                    document.getElementById("btnAlteraOrcaMobile").addEventListener("click", alterarOrcamento);
                    document.getElementById("btnPrincipalMobile").addEventListener("click", home);
                    document.getElementById("btnPrincipal").addEventListener("click", home);
                    document.getElementById("btnPedidos").addEventListener("click", mostraOrcamentos);
                    document.getElementById("btnPedidosMobile").addEventListener("click", mostraOrcamentos);
                    document.getElementById("qtdeProdutoWeb").addEventListener("input", calculaProduto);
                    document.getElementById("qtdeProdutoWeb").addEventListener("keyup", addPedidoEnter);
                    document.getElementById("qtdeProduto").addEventListener("input", function () {
                        document.getElementById("totalProduto").value = numberToReal(this.value * produtoSelecionado.valor);
                    });
                    document.getElementById("qtdeProduto").addEventListener("keypress", function (event) {
                        if (event.keyCode == 13) addItem("qtdeProduto", "datelhe_item", false);
                    });
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

                }
                if (usuario.idpermissao == 2) {
                    listaProdutosSolicitados();
                    checarTipoUsuario();
                }
                document.getElementById("addItensWeb").style.display = "none";
                document.getElementById("informatacaoCliente").style.display = "none";
                document.getElementById("resumoVendedor").value = usuario.nome.toUpperCase();
                consultaPermissoes();
                $('#modalpreload').modal('close');
                iniciou = 1;
            }
        }
        request.open("POST", url + "php/configuracao.php", true);
        request.send();
    }

    function home() {
        $(".menuOpcoes li a").removeClass();
        this.className = "active";
        document.getElementById("configuracao").style.display = "none";
        document.getElementById("conteudo_painel").style.display = "block";
        if (usuario.idpermissao == 2) {
            document.getElementById("tabs-menu").style.display = "block";
        }
        document.getElementById("listaOrcamentos").style.display = "none";
        $('.button-collapse').sideNav('hide');
    }

    function mostraOrcamentos() {
        $('.button-collapse').sideNav('hide');
        $('#modalpreload').modal('open');
        $(".menuOpcoes li a").removeClass();
        this.className = "active";
        document.getElementById("configuracao").style.display = "none";
        document.getElementById("conteudo_painel").style.display = "none";
        document.getElementById("tabs-menu").style.display = "none";
        document.getElementById("listaOrcamentos").style.display = "block";
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                orcamentos = [];
                orcamentos = JSON.parse(request.responseText);
                var lista = "";
                for (var i = 0; i < orcamentos.length; i++) {
                    lista += "<li class='orcaitem' id='" + i + "'><div class='collapsible-header'>" + orcamentos[i].NET_PKN_SEQUENCIAL + " - " + orcamentos[i].NET_A_CLI_NOME.substr(0, 35) + ".</div></li>";
                }
                document.getElementById("orcamentos").innerHTML = lista;
                var elems = document.getElementsByClassName("orcaitem"), i;
                for (i = 0; i < elems.length; i++) {
                    document.getElementsByClassName("orcaitem")[i].removeEventListener("click", function () {
                    });
                    document.getElementsByClassName("orcaitem")[i].addEventListener("click", function () {
                        mostraPedido(orcamentos[this.id]);
                    });
                }
                $('#modalpreload').modal('close');
            }
        }
        if (usuario.idpermissao == 2) {
            request.open("POST", url + "php/getOrcamentos.php", true);
            request.send();
        } else if (usuario.idpermissao == 3) {
            request.open("POST", url + "php/getOrcamentoFuncionario.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("id=" + usuario.codfuncionario);
        } else {
            request.open("POST", url + "php/getOrcamentoCliente.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("id=" + usuario.codparticipante);
        }
    }

    function mostraPedido(orca) {
        orcamento = orca;
        document.getElementById("pedidoNum").innerHTML = "NUMERO: " + orcamento.NET_PKN_SEQUENCIAL;
        document.getElementById("pedidoCliente").innerHTML = "CLIENTE: " + orcamento.NET_A_CLI_NOME.toUpperCase();
        document.getElementById("pedidoData").innerHTML = "DATA: " + dataAtualFormatada(orcamento.NET_D_DATA);
        $("#modalDadosPedido").modal({dismissible: false});
        $("#modalDadosPedido").modal("open");
    }

    function excluirPedido() {
        $("#modalDadosPedido").modal("close");
        $("#modalpreload").modal("close");
        var verificar = confirm("Deseja excluir o pedido ?");
        if (verificar == false) {
            return;
        }
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            mostraOrcamentos();
        }
        request.open("GET", url + "php/excluirPedido.php?id=" + orcamento.NET_PKN_SEQUENCIAL, true);
        request.send();

    }

    function listaProdutosSolicitados() {
        document.getElementById("preloadItens").style.display = "block";
        document.getElementById("produtos").innerHTML = "";
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
                                    unidade: result[i].itens[j].unidade,
                                    orcamentos: [result[i]]
                                });
                        }
                    }
                }
                produtos.sort(function (a, b) {
                    return a.descricao < b.descricao ? -1 : a.descricao > b.descricao ? 1 : 0;
                });
                var select = "";
                var qtdeAcumulada = 0;
                for (var i = 0; i < produtos.length; i++) {
                    select += '    <a class="col s12 itemlista itemacumulado" id="' + i + '">' +
                        '<div class="row" style="padding: 5px;"><div class="col s12">' + produtos[i].descricao.substring(0, 40) + '</div></div>'
                        + '<div class="row"><div class="col m4 l8" ></div>' +
                        '<div class="col s3 m2 l1" style="text-align: center">UNIDADE</br>' + produtos[i].unidade + '</div>'
                        + '<div class="col s3 m2 l1" style="text-align: center">VENDIDO</br>' + produtos[i].qtde + '</div>'
                        + '<div class="col s3 m2 l1" style="text-align: center">ESTOQUE</br>0</div>'
                        + '<div class="col s3 m2 l1" style="text-align: center">SALDO</br>' + (0 - produtos[i].qtde) + '</div></div>'
                        + '</a>';
                    qtdeAcumulada += produtos[i].qtde;
                }
                document.getElementById("preloadItens").style.display = "none";
                document.getElementById("produtos").innerHTML = select;
                document.getElementById("qtdeItemAcumulado").value = qtdeAcumulada;

                for (var i = 0; i < produtos.length; i++) {
                    document.getElementsByClassName("itemacumulado")[i].removeEventListener("click", function () {
                    });
                    document.getElementsByClassName("itemacumulado")[i].addEventListener("click", function () {
                        orcamentos = [];
                        var pedidos = "";
                        for (var j = 0; j < produtos[this.id].orcamentos.length; j++) {
                            var orcamento = produtos[this.id].orcamentos[j];
                            orcamentos.push(orcamento);
                            for (var k = 0; k < orcamento.itens.length; k++) {
                                if (produtos[this.id].codigo == orcamento.itens[k].PRO_PKN_CODIGO) {
                                    pedidos += '<div class="row zebra"><a class="orcamentoSelecionado" id="' + orcamento.NET_PKN_SEQUENCIAL + '"  style="color:#000">';
                                    pedidos += '<div class="col s12 m12 l6 subtitleitem"><div class="col s1 m2 l2">' + orcamento.NET_PKN_SEQUENCIAL + '</div>';
                                    pedidos += '<div class="col s11 m10 l10">' + orcamento.NET_A_CLI_NOME.substring(0, 30) + '</div></div>';
                                    pedidos += '<div class="col s12 m12 l6 subdetalheitem"><div class="col s9 m10 l10">' + orcamento.itens[k].descricao + '</div>';
                                    pedidos += '<div class="col s1 m1 l1">' + orcamento.itens[k].NET_ITEM_QTD + '</div></div>';
                                    pedidos += '</a></div>';
                                }
                            }
                        }
                        document.getElementById("itemPedido").innerHTML = pedidos;
                        var elems = document.getElementsByClassName("orcamentoSelecionado"), i;
                        for (i = 0; i < elems.length; i++) {
                            document.getElementsByClassName("orcamentoSelecionado")[i].removeEventListener("click", function () {
                            });
                            document.getElementsByClassName("orcamentoSelecionado")[i].addEventListener("click", function () {
                                for (var j = 0; j < orcamentos.length; j++) {
                                    if (orcamentos[j].NET_PKN_SEQUENCIAL == this.id) {
                                        var verificar = confirm("Deseja alterar pedido");
                                        if (verificar == true) {
                                            $(".modalItemOrcamentos").modal("close");
                                            alteraOrcamento(orcamentos[j]);
                                        }
                                        break;
                                    }

                                }
                            });
                        }
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
            document.getElementById("informatacaoCliente").style.display = "block";
            document.getElementById("opcaoSelecao").style.display = "none";
            document.getElementById("addItensWeb").style.display = "block";
            document.getElementById("infoNome").value = cliente.PAR_A_RAZAOSOCIAL;
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
            if (document.getElementById("tipoUsuario").value >= 1 && document.getElementById("tipoUsuario").value <= 3 ||
                document.getElementById("tipoUsuario").value == 5) {
                preencheAutoFuncionario();
                document.getElementById("autofuncionario").style.display = "block";
                document.getElementById("autocomcliente").style.display = "none";
            } else {
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
                        document.getElementById("nameLogin").innerHTML = "<label class='namePerson'>" + usuario.nome.substr(0, 15) + ".</label>";
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
                    document.getElementById("email").addEventListener("keypress", function (event) {
                        if (event.keyCode == 13) login();
                    });
                    document.getElementById("password").addEventListener("keypress", function (event) {
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

        if (cliente != null) {
            var result = confirm("Orcamento não finalizado,Deseja sair ?");
            if (result == false) {
                return;
            }
        }
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
            document.getElementById("menu_painel").style.display = "none";
            document.getElementById("opcaoSelecao").style.display = "none";
            document.getElementById("addItens").style.display = "block";
            document.getElementById("informatacaoCliente").style.display = "block";
            document.getElementById("infoNome").value = cliente.PAR_A_RAZAOSOCIAL;
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
        if (item.produto.valor <= 0) {
            Materialize.toast('PRODUTO NÃO CONTEM PREÇO', 5000);
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
                document.getElementById("submenu").style.display = "block";
                document.getElementById("totalOrcamento").innerHTML = "Total R$ " + numberToReal(total);
                document.getElementById("precoProduto").value = "";
                document.getElementById("produto_orcamento").value = "";
                document.getElementById("qtdeProduto").value = "";
                document.getElementById("unidadeProduto").value = "";
                document.getElementById("totalProduto").value = "";
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
        document.getElementById("resumotTotalItens").value = numberToReal(total);
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
            if (i % 2 == 0) {
                itens += '<div class="row" style="font-size: 0.75em">';
            } else {
                itens += '<div class="row" id="subdescricaoitem" style="font-size: 0.75em">';
            }
            itens += '<div class="col s2" id="descricaoitem">COD</br>' + item.produto.idproduto + '</div>';
            itens += '<div class="col s10" id="descricaoitem">ITEM</br>' + item.produto.descricao.toUpperCase() + '</div>';
            itens += '<div class="col s12">';
            itens += '<div class="col s2"></div>';
            itens += '<div class="col s2">R$ ' + numberToReal(item.produto.valor) + ' </div>';
            itens += '<div class="col s1"> X </div>';
            itens += '<div class="col s3">' + mascaraQuantidade(item.qtde) + ' ' + item.produto.unidade + '</div>';
            itens += '<div class="col s1">-</div>';
            itens += '<div class="col s2">R$ ' + numberToReal(itensOrcamento[i].total) + '</div>';
            itens += '</div>';
            itens += '</div>';
            itens += '</li>';

            itensWeb += "<li style='border:1px solid #5f5c5c' id='" + item.produto.idproduto + "'>";
            itensWeb += '<div class="row" style="background-color: #fff;padding:10px;">';
            itensWeb += '<div class="col s1" >' + item.produto.idproduto + '</div>';
            itensWeb += '<div class="col s4" >' + item.produto.descricao.toUpperCase() + '</div>';
            itensWeb += '<div class="col s1">' + item.produto.unidade + '</div>';
            itensWeb += '<div class="col s1">' + mascaraQuantidade(item.qtde) + '</div>';
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
        document.getElementById("datelhe_item").innerHTML = itens;
        document.getElementById("detalheItemWeb").innerHTML = itensWeb;
        document.getElementById("totalOrcamento").innerHTML = "Total R$ " + numberToReal(total);
        var acumulador = "";
        for (var i = 0; i < acumulaUnidade.length; i++) {
            acumulador += "<li class='collection-item'>" + acumulaUnidade[i].unidade + " : " + mascaraQuantidade(acumulaUnidade[i].qtde) + "</li>";
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
                console.log(elems.length);
                if (itensOrcamento.length > 0) {
                    var descricao = itensOrcamento[indexProduto].produto.descricao;
                    document.getElementById("nomeProduto").innerHTML = "PRODUTO: " + descricao;
                    $("#opcaoItem").modal();
                    $("#opcaoItem").modal('open');
                }
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

    function alterarOrcamento() {
        $('#modalpreload').modal('open');
        console.log(usuario.codfuncionario);
        orcamento.forma = $("#selectFormaPagamento").val();
        orcamento.usuario = cliente;
        orcamento.funcionario = usuario.codfuncionario;
        orcamento.total = parseFloat(total);
        orcamento.itens = itensOrcamento;
        var dado = JSON.stringify(orcamento);
        console.log(orcamento);
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                limparOrcamento();
                $('#modalpreload').modal('close');
                $('#modalInfo').modal('open');
                $('ul.tabs').tabs('select_tab', 'home');
                listaProdutosSolicitados();

            }
        }
        request.open("POST", url + "php/alteraOrcamento.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("dado=" + dado);
    }

    function limparOrcamento() {
        if (usuario.idpermissao == 2) {
            listaProdutosSolicitados();
        }
        cliente = null;
        itensOrcamento = [];
        total = 0;

        document.getElementById("menu_painel").style.display = "block";
        document.getElementById("qtdeProduto").value = "";
        document.getElementById("pesquisaRazaoSocial").value = "";
        document.getElementById("titleModal").innerHTML = "";
        document.getElementById("tipoPesquisa1").innerHTML = "";
        document.getElementById("tipoPesquisa2").innerHTML = "";
        document.getElementById("tipoPesquisa3").innerHTML = "";
        document.getElementById("tipoPesquisa4").innerHTML = "";
        document.getElementById("msgModal").innerHTML = "Orcamento enviado com sucesso";
        //document.getElementById("selectCliente").style.display = "block";
        document.getElementById("opcaoSelecao").style.display = "block";
        document.getElementById("addItens").style.display = "none";
        document.getElementById("menu_painel").style.display = "block";
        document.getElementById("datelhe_item").innerHTML = "";
        document.getElementById("detalheItemWeb").innerHTML = "";
        document.getElementById("resumoQtdeItem").value = "0";
        document.getElementById("resumoQtdeKgItem").innerHTML = " ";
        document.getElementById("resumotTotalItens").value = "0,00";
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
        document.getElementById("totalOrcamento").innerHTML = "Total R$";
        document.getElementById("resumoQtdeItem").value = itensOrcamento.length;
        document.getElementById("resumotTotalItens").value = numberToReal(total);
        document.getElementById("btnFinalizaOrcamentoWeb").style.display = "block";
        document.getElementById("btnAlteraOrcamento").style.display = "none";
        document.getElementById("btnFinalizaOrcamento").style.display = "block";
        document.getElementById("btnAlteraOrcaMobile").style.display = "none";
        $('ul.tabs').tabs('select_tab', 'pedidos');
    }

//Salva o usuario
    function salvaUsuario() {
        if (cliente == null && funcionario == null) {
            Materialize.toast('Selecione um usuario', 4000);
            return;
        }
        var img = document.getElementById("file");
        //var file_data = img.files[0];
        var form_data = new FormData();
        if (verificaNovoEmail(document.getElementById('emailUserNovo').value) == false) {
            return;
        }
        // form_data.append('file', file_data);
        form_data.append('email', document.getElementById('emailUserNovo').value);
        form_data.append('senha', document.getElementById('senhaUserNovo').value);
        form_data.append('permissao', document.getElementById('tipoUsuario').value);

        if (document.getElementById("tipoUsuario").value >= 1 && document.getElementById("tipoUsuario").value <= 3) {
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
        preencheClientes();
        initConfiguracao();

    }

    function consultaPermissoes() {
        document.getElementById("nomeUser").innerHTML = usuario.nome.toUpperCase();
        document.getElementById("btnPrincipal").style.display = "block";
        document.getElementById("btnPrincipalMobile").style.display = "block";
        document.getElementById("btnPedidos").style.display = "block";
        document.getElementById("btnPedidosMobile").style.display = "block";
        document.getElementById("conteudo_painel").style.display = "block";
        document.getElementById("funcionario_orcamento").style.display = "block";
        document.getElementById("btnConfiguracao").style.display = "block";
        document.getElementById("btnConfiguracaoMobile").style.display = "block";
        if (usuario.idpermissao == 1) {
            document.getElementById("tabs-menu").style.display = "none";
            document.getElementById("conteudo_painel").style.display = "none";
            document.getElementById("funcionario_orcamento").style.display = "none";
            document.getElementById("btnPrincipal").style.display = "none";
            document.getElementById("btnPrincipalMobile").style.display = "none";
            document.getElementById("btnPedidosMobile").style.display = "none";
            document.getElementById("btnPedidos").style.display = "none";
            //document.getElementById("selectCliente").style.display = "none";
            document.getElementById("btnConfiguracao").style.display = "none";
            document.getElementById("btnConfiguracaoMobile").style.display = "none";
        }
        if (usuario.idpermissao == 2) {
            document.getElementById("container").style.display = "block";
            document.getElementById("tabs-menu").style.display = "block"
            document.getElementById("funcionario_orcamento").style.display = "block";
            //document.getElementById("selectCliente").style.display = "block";
            document.getElementById("menu_cadastros").style.display = "block";
            document.getElementById("menu_pedidos").style.display = "block";
            document.getElementById("btnConfiguracao").style.display = "block";
            document.getElementById("btnConfiguracaoMobile").style.display = "block";
            $('ul.tabs').tabs('select_tab', 'home');
        }
        if (usuario.idpermissao == 3) {
            document.getElementById("tabs-menu").style.display = "none";
            $('ul.tabs').tabs('select_tab', 'pedidos');
            document.getElementById("funcionario_orcamento").style.display = "block";
            //document.getElementById("selectCliente").style.display = "block";
            document.getElementById("btnConfiguracao").style.display = "none";
            document.getElementById("btnConfiguracaoMobile").style.display = "none";
        }
        if (usuario.idpermissao == 4) {
            document.getElementById("tabs-menu").style.display = "none";
            $('ul.tabs').tabs('select_tab', 'pedidos');
            document.getElementById("conteudo_painel").style.display = "block";
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    cliente = JSON.parse(request.responseText);
                    if (cliente != null) {
                        document.getElementById("funcionario_orcamento").style.display = "block";
                        document.getElementById("btnConfiguracao").style.display = "none";
                        document.getElementById("btnConfiguracaoMobile").style.display = "none";
                        //document.getElementById("selectCliente").style.display = "none";

                        if (window.innerWidth > 900) {
                            document.getElementById("informatacaoCliente").style.display = "block";
                            document.getElementById("addItensWeb").style.display = "block";
                            document.getElementById("infoNome").value = cliente.PAR_A_RAZAOSOCIAL;
                            selectProdutoCliente(cliente, "autocompleteproduto", "precoProdutoWeb", "unidadeProdutoWeb", "dialogProduto");
                            document.getElementById("autocompleteproduto").focus();
                        } else {
                            document.getElementById("selectCliente").style.display = "none";
                            document.getElementById("addItens").style.display = "block";
                            document.getElementById("informatacaoCliente").style.display = "block";
                            document.getElementById("infoNome").value = "RAZAO SOCIAL: " + cliente.PAR_A_RAZAOSOCIAL;
                            selectProdutoCliente(cliente, "produto_orcamento", "precoProduto", "unidadeProduto", "dlgproduto")
                        }
                    }
                }
            }
            request.open("POST", url + "php/getCliente.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("codigo=" + usuario.codparticipante);
        }
        if (usuario.idpermissao == 5) {
            document.getElementById("tabs-menu").style.display = "none";
            document.getElementById("btnPrincipal").style.display = "none";
            document.getElementById("btnPrincipalMobile").style.display = "none";
            document.getElementById("btnPedidos").style.display = "none";
            document.getElementById("btnPedidosMobile").style.display = "none";
            document.getElementById("conteudo_painel").style.display = "none";
            document.getElementById("funcionario_orcamento").style.display = "none";
            document.getElementById("btnConfiguracao").style.display = "none";
            document.getElementById("btnConfiguracaoMobile").style.display = "none";
            conferirOrcamentos();
        }
        document.getElementById("container").style.display = "block";

    }

    function conferirOrcamentos() {
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                var lis = "";
                orcamentos = [];
                orcamentos = JSON.parse(request.responseText);
                for(var i = 0 ; i < orcamentos.length; i++){
                    lis += '<li><div class="row"><div class="col s12">';
                    lis += '<div class="col s2"> 342</div>';
                    lis += '<div class="col s10"> TESTE JOSE ALMEIDA TESTE</div></div>';
                    lis += '<div class="col s12 subitem">';
                    lis += '<div class="col s10"> 14/08/1997</div>';
                    lis += '<div class="col s2"> STATUS </div></div></div></li>';
                }
                document.getElementById("orcamentosConferir").innerHTML = lis;
            }
        }
        request.open("POST", url + "php/getOrcamentos.php", true);
        request.send();

    }

    function alteraOrcamento(pedido) {
        orcamento = pedido;
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                cliente = JSON.parse(request.responseText);
                if (cliente != null) {
                    document.getElementById("funcionario_orcamento").style.display = "block";
                    document.getElementById("btnConfiguracao").style.display = "none";
                    document.getElementById("btnConfiguracaoMobile").style.display = "none";
                    document.getElementById("selectCliente").style.display = "none";

                    if (window.innerWidth > 900) {
                        document.getElementById("informatacaoCliente").style.display = "block";
                        document.getElementById("addItensWeb").style.display = "block";
                        document.getElementById("infoNome").value = cliente.PAR_A_RAZAOSOCIAL;
                        selectProdutoCliente(cliente, "autocompleteproduto", "precoProdutoWeb", "unidadeProdutoWeb", "dialogProduto");
                        document.getElementById("autocompleteproduto").focus();
                    } else {
                        document.getElementById("selectCliente").style.display = "none";
                        document.getElementById("addItens").style.display = "block";
                        document.getElementById("informatacaoCliente").style.display = "block";
                        document.getElementById("infoNome").value = cliente.PAR_A_RAZAOSOCIAL;
                        selectProdutoCliente(cliente, "produto_orcamento", "precoProduto", "unidadeProduto", "dlgproduto")
                    }
                    console.log(orcamento.itens);
                    for (var i = 0; i < orcamento.itens.length; i++) {
                        var produto = new Object();
                        produto.idproduto = orcamento.itens[i].PRO_PKN_CODIGO;
                        produto.descricao = orcamento.itens[i].descricao;
                        produto.valor = orcamento.itens[i].NET_M_VALOR_UNITARIO;
                        produto.unidade = orcamento.itens[i].unidade;

                        var item = new Object();
                        item.produto = produto;
                        item.qtde = parseFloat(orcamento.itens[i].NET_ITEM_QTD);
                        item.unitaro = orcamento.itens[i]
                        item.total = produto.valor * item.qtde;
                        itensOrcamento.push(item);

                    }
                    console.log(itensOrcamento);
                    document.getElementById("btnAlteraOrcamento").style.display = "block";
                    document.getElementById("btnFinalizaOrcamentoWeb").style.display = "none";
                    document.getElementById("btnAlteraOrcaMobile").style.display = "block";
                    document.getElementById("btnFinalizaOrcamento").style.display = "none";
                    document.getElementById("menu_painel").style.display = "none";
                    document.getElementById("informatacaoCliente").style.display = "block";
                    $('ul.tabs').tabs('select_tab', 'pedidos');
                    atualizaLista("detalheItemWeb", true);
                }
            }
        }
        request.open("POST", url + "php/getCliente.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("codigo=" + orcamento.PAR_PKN_CODIGO);
    }

//Incluir os produtos do cliente dentro do select
    function selectProdutoCliente(cliente, autocompete, preco, unidade, dialog) {
        $('#modalpreload').modal('open');
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                produtoCliente = JSON.parse(request.responseText);
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
                            if (autocompete == "produto_orcamento") {
                                document.getElementById("qtdeProduto").focus();
                            } else {
                                document.getElementById("qtdeProdutoWeb").focus();
                            }
                        });
                    }
                });
                document.getElementById(autocompete).addEventListener("blur", function () {
                    setTimeout(function () {
                        document.getElementById(dialog).style.display = "none";
                    }, 200);
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
                                document.getElementById(autocompete).value = produtoCliente[i].descricao.toUpperCase();
                                document.getElementById(preco).value = numberToReal(produtoCliente[i].valor);
                                document.getElementById(unidade).value = produtoCliente[i].unidade.toString();
                                if (autocompete == "produto_orcamento") {
                                    document.getElementById("qtdeProduto").focus();
                                } else {
                                    document.getElementById("qtdeProdutoWeb").focus();
                                }

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

    function pegaTecla() {
        cancelarProduto();
        var tecla = event.keyCode;
        alert(tecla);
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
                clientes = [];
                clientes = JSON.parse(request.responseText);
                autoCompleteCliente("pesquisaRazaoSocial");
                popularClienteAutoComplete();
            }
        }
        request.open("POST", url + "php/getClientes.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("nome=" + document.getElementById("autocompletecliente").value.toUpperCase());
        document.getElementById("autocompletecliente").addEventListener("blur", function () {
            setTimeout(function () {
                document.getElementById("dialogcliente").style.display = "none";
            }, 200);
        });
    }

    var DURACAO_DIGITACAO = 400,
        digitando = false,
        tempoUltimaDigitacao;

    function autoCompleteCliente(autocomplete) {
        $('ul.tipo').tabs('select_tab', 'tipoPesquisa1');

        document.getElementById(autocomplete).addEventListener("input", function () {
            atualizaPesquisa(autocomplete);
        });
    }

    function atualizaPesquisa(autocomplete) {
        if (!digitando) {
            digitando = true;
            document.getElementById("tipoPesquisa1").innerHTML = "";
            document.getElementById("tipoPesquisa2").innerHTML = "";
            document.getElementById("tipoPesquisa3").innerHTML = "";
            document.getElementById("tipoPesquisa4").innerHTML = "";
            document.getElementById("preloadPesquisa").style.display = "block";
        }
        tempoUltimaDigitacao = (new Date()).getTime();

        setTimeout(function () {
            var digitacaoTempo = (new Date()).getTime();
            var diferencaTempo = digitacaoTempo - tempoUltimaDigitacao;

            if (diferencaTempo >= DURACAO_DIGITACAO && digitando) {
                digitando = false;
                var razao = "";
                var nome = "";
                var doc = "";
                var local = "";
                var str = document.getElementById(autocomplete).value;
                if (str != "") {
                    for (var i = 0; i < clientes.length; i++) {
                        var endereco = ' ' + clientes[i].PAR_A_ENDERECO + '' +
                            ' ' + clientes[i].PAR_A_NUMERO + ' - ' + clientes[i].PAR_A_BAIRRO + '/' +
                            '' + clientes[i].PAR_A_CIDADE;
                        if (clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase().startsWith(str.toUpperCase())) {
                            razao += '<div class="col s12 clientePesquisa" id="' + i + '">';
                            razao += '<div class="col s2">';
                            razao += '<img class="imgresult circle" src="uploads/default.png">';
                            razao += '    </div>';
                            razao += '    <div class="col s10">';
                            razao += '    <div class="col s12">';
                            razao += '    <p>' + clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase() + '</p>';
                            razao += '    </div>';
                            razao += '    <div class="col s12">';
                            razao += '    <label>' + clientes[i].PAR_A_LOGRADOURO + '' +
                                ' ' + clientes[i].PAR_A_ENDERECO + '' +
                                ' ' + clientes[i].PAR_A_NUMERO + ' - ' + clientes[i].PAR_A_BAIRRO + '/' +
                                '' + clientes[i].PAR_A_CIDADE + '</br>' +
                                '' + clientes[i].PAR_A_CNPJ_CPF + '</label>';
                            razao += '    </div>';
                            razao += '    </div>';
                            razao += '</div> ';
                        }
                        if (clientes[i].PAR_A_NOME_FANTASIA.toUpperCase().startsWith(str.toUpperCase())) {
                            nome += '<div class="col s12 clientePesquisa" id="' + i + '">';
                            nome += '<div class="col s2">';
                            nome += '<img class="imgresult circle" src="uploads/default.png">';
                            nome += '    </div>';
                            nome += '    <div class="col s10">';
                            nome += '    <div class="col s12">';
                            nome += '    <p>' + clientes[i].PAR_A_NOME.toUpperCase() + '</p>';
                            nome += '    </div>';
                            nome += '    <div class="col s12">';
                            nome += '    <label>' + clientes[i].PAR_A_LOGRADOURO + '' +
                                ' ' + clientes[i].PAR_A_ENDERECO + '' +
                                ' ' + clientes[i].PAR_A_NUMERO + ' - ' + clientes[i].PAR_A_BAIRRO + '/' +
                                '' + clientes[i].PAR_A_CIDADE + '</br>' +
                                '' + clientes[i].PAR_A_CNPJ_CPF + '</label>';
                            nome += '    </div>';
                            nome += '    </div>';
                            nome += '</div> ';
                        }
                        if (endereco.indexOf(str.toUpperCase()) >= 0) {
                            local += '<div class="col s12 clientePesquisa" id="' + i + '">';
                            local += '<div class="col s2">';
                            local += '<img class="imgresult circle" src="uploads/default.png">';
                            local += '    </div>';
                            local += '    <div class="col s10">';
                            local += '    <div class="col s12">';
                            local += '    <p>' + clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase() + '</p>';
                            local += '    </div>';
                            local += '    <div class="col s12">';
                            local += '    <label>' + clientes[i].PAR_A_LOGRADOURO + '' +
                                ' ' + clientes[i].PAR_A_ENDERECO + '' +
                                ' ' + clientes[i].PAR_A_NUMERO + ' - ' + clientes[i].PAR_A_BAIRRO + '/' +
                                '' + clientes[i].PAR_A_CIDADE + '</br>' +
                                '' + clientes[i].PAR_A_CNPJ_CPF + '</label>';
                            local += '    </div>';
                            local += '    </div>';
                            local += '</div> ';
                        }
                    }
                }
                if (clientes.length > 0) {
                    document.getElementById("preloadPesquisa").style.display = "none";
                    document.getElementById("tipoPesquisa1").innerHTML = razao;
                    document.getElementById("tipoPesquisa2").innerHTML = nome;
                    document.getElementById("tipoPesquisa3").innerHTML = doc;
                    document.getElementById("tipoPesquisa4").innerHTML = local;
                    var elems = document.getElementsByClassName("clientePesquisa"), i;
                    for (i = 0; i < elems.length; i++) {
                        document.getElementsByClassName("clientePesquisa")[i].removeEventListener("click", function () {
                        });
                        document.getElementsByClassName("clientePesquisa")[i].addEventListener("click", function () {
                            limparOrcamento();
                            cliente = clientes[this.id];
                            console.log(cliente);
                            habilitaTelaItem()
                            hideKeyBoard();
                        });
                    }
                    document.getElementById("dialogcliente").style.display = "block";
                } else {
                    document.getElementById("dialogcliente").style.display = "none";
                }
            }
        }, DURACAO_DIGITACAO);
    }

    function popularClienteAutoComplete() {

        document.getElementById("autocompletecliente").addEventListener("input", function () {
            var select = "";
            for (var i = 0; i < clientes.length; i++) {
                if (clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase().startsWith(this.value.toUpperCase())) {
                    select += '<div class="selecionaCliente" id="' + i + '">' + clientes[i].PAR_A_RAZAOSOCIAL.toUpperCase() + '</div>';
                }
            }
            if (clientes.length > 0) {
                document.getElementById("dialogcliente").innerHTML = select;
                var elems = document.getElementsByClassName("selecionaCliente"), i;
                for (i = 0; i < elems.length; i++) {
                    document.getElementsByClassName("selecionaCliente")[i].removeEventListener("click", function () {
                    });
                    document.getElementsByClassName("selecionaCliente")[i].addEventListener("click", function () {
                        document.getElementById("dialogcliente").style.display = "none";
                        limparOrcamento();
                        cliente = clientes[this.id];
                        console.log(cliente);
                        document.getElementById("autocompletecliente").value = this.innerHTML;
                        hideKeyBoard();
                    });
                }
                document.getElementById("dialogcliente").style.display = "block";
            } else {
                document.getElementById("dialogcliente").style.display = "none";
            }

        });
        document.getElementById("autocompletecliente").addEventListener("blur", function () {
            setTimeout(function () {
                document.getElementById("dialogcliente").style.display = "none";
            }, 200);
        });
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
        $(".menuOpcoes li a").removeClass();
        this.className = "active";
        document.getElementById("conteudo_painel").style.display = "none";
        document.getElementById("tabs-menu").style.display = "none";
        document.getElementById("listaOrcamentos").style.display = "none";
        $('.button-collapse').sideNav('hide');
        document.getElementById("configuracao").style.display = "block";
        document.getElementById("cor_menu").value = config.cor_menu;
        document.getElementById("cor_fundo").value = config.cor_fundo;
        document.getElementById("cor_conteudo").value = config.cor_conteudo;
        document.getElementById("nome_empresa").value = config.nome_empresa;
        document.getElementById("cor_menu").addEventListener("change", function () {
            mudarCorElemento("menu_painel", "cor_menu")
        });
        document.getElementById("cor_conteudo").addEventListener("change", function () {
            mudarCorElemento("conteudo_pa-fundo", "cor_fundo")
        });
        document.getElementById("cor_fundo").addEventListener("change", function () {
            mudarCorElemento("container", "cor")
        });
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
        /*document.getElementById("fileLogo").addEventListener("change", function () {
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
         });*/
    }

    function desativar() {
        $(".menuOpcoes li a").removeClass();
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
        document.getElementById("resumotTotalItens").value = numberToReal(total);
        document.getElementById("btnPrincipalMobile").className = "active";
        document.getElementById("configuracao").style.display = "none";
        document.getElementById("conteudo_painel").style.display = "block";
        document.getElementById("tabs-menu").style.display = "block";
        document.getElementById("listaOrcamentos").style.display = "none";
        $('.button-collapse').sideNav('hide');

        limparOrcamento();
    }

    window.onbeforeunload = function () {
        return "Os dados do formulário serão perdidos.";
    }

})
;