function initLogin() {
    var verificarEmail = false;
    var usuario = null;
    var config = null;
    var validaEmail = false;
    var produtoCliente = [];
    var produtoSelecionado = null;
    var clientes = [];
    var itensOrcamento = [];
    var funcionario = null;
    var cliente = null;
    var url = "";

    //Inicia a Configuração de Layout e Eventos
    function initConfiguracao() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                config = JSON.parse(this.responseText);
                iniciarConfiguracoes(config);
                document.getElementById("btnConfiguracao").addEventListener("click", abrirConfiguracao); //tela de configuracao de layout
                document.getElementById("logout").addEventListener("click", logout); //logout
                document.getElementById("btnConfiguracaoMobile").addEventListener("click", abrirConfiguracao);//abri as configuração de cores da tela
                document.getElementById("logoutMobile").addEventListener("click", logout); //Faz logout
                document.getElementById("btnSalvaUsuario").addEventListener("click", salvaUsuario);// Salva o Usuario
                document.getElementById("btnOrcamento").addEventListener("click", habilitaPedido); //HABILITA O FORMULARIO DE PEDIDO
                document.getElementById("btnOrcamentoMobile").addEventListener("click", habilitaPedido);
                document.getElementById("btnOrcaProximo").addEventListener("click", habilitaTelaItem);//FUNÇÕE DO ORCAMENTO DO FUNCIONARIO
                document.getElementById("addItemOrca").addEventListener("click", addItem); // Adiciona Item
                document.getElementById("btnFinalizaOrcamento").addEventListener("click", finalizaOrcamento);//Finalizar Orcamento
                document.getElementById("btnAdicionarItem").addEventListener("click", addItem);//ADICIONA O ITEM NA LISTA DE ITENS DO PEDIDO
                document.getElementById("btnSalvaOrcamento").addEventListener("click", finalizaOrcamento);
                document.getElementById("verOrcamentos").addEventListener("click", listaOrcamentos);
                document.getElementById("verOrcamentosMobile").addEventListener("click", listaOrcamentos);
                checarTipoUsuario();
                consultaPermissoes();
                $('#modalpreload').modal('close');
            }
        }
        request.open("POST", url + "php/configuracao.php", true);
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
            if ($(this).val() == 4) {
                document.getElementById("selecioneCliente").style.display = 'block';
            } else {
                document.getElementById("selecioneCliente").style.display = 'none';
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
                console.log("Sessao Verificada");
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
            document.getElementById("menu_pedido").style.display = "none";

            document.getElementById("infoNome").innerHTML = "RAZAO SOCIAL: " + cliente.PAR_A_RAZAOSOCIAL;
            document.getElementById("infoCpfCnpj").innerHTML = "CNPJ/CPF: " + cliente.PAR_A_CNPJ_CPF;
            document.getElementById("infoEndereco").innerHTML = "ENDERECO: " + cliente.PAR_A_LOGRADOURO + " " + cliente.PAR_A_ENDERECO + " " + cliente.PAR_A_NUMERO;
            selectProdutoCliente(cliente, "produto_orcamento");
        } else {
            Materialize.Toast.removeAll();
            Materialize.toast('Por favor selecione o cliente', 4000);
        }
    }

    // Adicionar Item na lista
    function addItem() {
        var item = new Object();
        item.produto = produtoSelecionado;
        if (item.produto != null) {
            item.qtde = document.getElementById("qtdeProduto").value;
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
                var itens = document.getElementById("datelhe_item").innerHTML;
                itens += "<li style='border:1px solid #5f5c5c' class='itemCliente' id='"+item.produto.idproduto+"'>";
                itens += '<div class="row">';
                itens += '<div class="col s12" id="descricaoitem">' + item.produto.descricao.toUpperCase() + '</div>';
                itens += '<div class="col s12" id="subdescricaoitem">';
                itens += '<div class="col s4">' + item.qtde + '</div>';
                itens += '<div class="col s4">' + numberToReal(item.produto.valor) + '</div>';
                itens += '<div class="col s4">' + numberToReal(itensOrcamento[i].total) + '</div>';
                itens += '</div>';
                itens += '</div>';
                itens += '</li>';
                document.getElementById("datelhe_item").innerHTML = itens;
            } else {
                //SE EXISTIR ELE REFAZ A TABELA E ALTERAR OS VALORES DO ITEM
                document.getElementById("datelhe_item").innerHTML = "";
                total = 0;
                for (var i = 0; i < itensOrcamento.length; i++) {
                    var itens = document.getElementById("datelhe_item").innerHTML;
                    itens += "<li style='border:1px solid #5f5c5c' class='itemCliente' id='"+item.produto.idproduto+"'>";
                    itens += '<div class="row">';
                    itens += '<div class="col s12" id="descricaoitem">' + item.produto.descricao.toUpperCase() + '</div>';
                    itens += '<div class="col s12" id="subdescricaoitem">';
                    itens += '<div class="col s4">' + item.qtde + '</div>';
                    itens += '<div class="col s4">' + numberToReal(item.produto.valor) + '</div>';
                    itens += '<div class="col s4">' + numberToReal(itensOrcamento[i].total) + '</div>';
                    itens += '</div>';
                    itens += '</div>';
                    itens += "</li>";
                    document.getElementById("datelhe_item").innerHTML = itens;
                    total = total + parseFloat(itensOrcamento[i].total);
                }
            }
            var elems = document.getElementsByClassName("itemCliente"), i;
            for (i = 0; i < elems.length; i++) {
                elems[i].addEventListener("click", function () {
                        document.getElementById("nomeProduto").value = "PRODUTO: "+itensOrcamento[i].produto.descricao;
                        $("#opcaoItem").modal();
                        $("#opcaoItem").modal('open');
                    });
            }
            document.getElementById("totalOrcamento").value = numberToReal(total);
            document.getElementById("precoProduto").value="";
            document.getElementById("produto_orcamento").value = "";
            document.getElementById("qtdeProduto").value = "";
            document.getElementById("unidadeProduto").value = "";
        }
    }

    function finalizaOrcamento() {
        $('#modalpreload').modal('open');
        var orcamento = new Object();
        orcamento.usuario = cliente;
        orcamento.funcionario = funcionario;
        var total = document.getElementById("totalpedido").value;
        total = total.replace(",", ".");
        orcamento.total = parseFloat(total);
        orcamento.itens = itensOrcamento;
        var dado = JSON.stringify(orcamento);
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
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
                document.getElementById("titleModal").innerHTML = "";
                document.getElementById("msgModal").innerHTML = "Orcamento enviado com sucesso";
                document.getElementById("btnSalvaOrcamento").style.display = "none";
                document.getElementById("selectCliente").style.display = "block";
                document.getElementById("addItens").style.display = "none";
                document.getElementById("menu_painel").style.display = "block";
                document.getElementById("menu_pedido").style.display = "block";
                document.getElementById("datelhe_item").innerHTML = "";
                itensOrcamento = [];
                $('#modalpreload').modal('close');
                $('#modalInfo').modal('open');
            }
        }
        request.open("POST", url + "php/salvaOrcamento.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("dado=" + dado);

    }

    //Salva o usuario
    function salvaUsuario() {
        $('#modalpreload').modal('open');
        var img = document.getElementById("file");
        var file_data = img.files[0];
        var form_data = new FormData();
        // form_data.append('file', file_data);
        form_data.append('nome', $('#nome').val());
        form_data.append('email', $('#emailUserNovo').val());
        form_data.append('senha', $('#senhaUserNovo').val());
        form_data.append('permissao', $('#tipoUsuario').val());
        if (cliente != null) {
            form_data.append('codparticipante', cliente.PAR_PKN_CODIGO);
        }
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                document.getElementById('nome').value = "";
                document.getElementById('emailUserNovo').value = "";
                document.getElementById('senhaUserNovo').value = "";
                document.getElementById("titleModal").innerHTML = "";
                document.getElementById("msgModal").innerHTML = "Usuario salvo com sucesso";
                document.getElementById("autocomplete-input").value = "";
                $('#modalpreload').modal('close');
                $('#modalInfo').modal('open');
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

        console.log(usuario.idpermissao);
        if (usuario.idpermissao == 1 || usuario.idpermissao == 2) {
            document.getElementById("tabs-menu").style.display = "block"
            $('ul.tabs').tabs('select_tab', 'home');
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
            preencheClientes();
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
    function selectProdutoCliente(cliente, select) {
        $('#modalpreload').modal('open');
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                document.getElementById("autocomplete-fantasia").placeholder = " ";
                document.getElementById("autocomplete-fantasia").value = cliente.PAR_A_NOME_FANTASIA;
                document.getElementById("cpfcnpj").placeholder = " ";
                document.getElementById("cpfcnpj").value = cliente.PAR_A_CNPJ_CPF;
                var result = JSON.parse(this.responseText);
                produtoCliente = result;
                var nomes = {};
                for (var i = 0; i < result.length; i++) {
                    nomes[result[i].descricao] = i;
                }
                $('input.autoproduto').autocomplete({
                    data: nomes,
                    limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
                    onAutocomplete: function (val) {
                        produtoSelecionado = produtoCliente[nomes[val]];
                        document.getElementById("precoProduto").value = numberToReal(produtoSelecionado.valor);
                        document.getElementById("unidadeProduto").value = produtoSelecionado.unidade.toString();
                    },
                    minLength: 1,
                });
                $('#modalpreload').modal('close');
            }
        }
        request.open("POST", url + "php/getProdutosCliente.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("codigo=" + cliente.TAB_PKN_CODIGO);
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
                var result = JSON.parse(this.responseText);
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
                    },
                    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
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