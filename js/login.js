function initLogin(){
	var verificarEmail = false;
	var usuario = null;
	var config = null;
	var validaEmail = false;
	var produtos = [];
	var produtoCliente = [];
	var clientes = [];
	var itensOrcamento = [];
	var funcionario = null;
	var cliente = null;

	function login(){
		if(verificarEmail == false){
			var email = document.getElementById("email").value;
			if(email.indexOf("@") >= 0 && email.indexOf(".com") >= 0 ){
				verificaEmail(email);
			}
		}else{
			verificaSenha(document.getElementById("password").value);
		}
	}

	//Verifica o E-mail 
	function verificaEmail(email){
		if(email.indexOf("@") >= 0 && email.indexOf(".com") >= 0 ){
			request = $.ajax({
				url: "php/consultaEmail.php",
				type: "post",
				data: "email="+email
			});
			request.done(function (response, textStatus, jqXHR){
				document.getElementById("progress").style.display = "block";
				if(response != "0"){
					usuario = JSON.parse(response);
					document.getElementById("checkConect").innerHTML = "<p><input type='checkbox' id='manterConectado' /><label for='manterConectado'>Manter conectado</label></p>";
					document.getElementById("nameLogin").innerHTML = "<label class='namePerson'>"+usuario.nome+"</label>";
					document.getElementById("progress").style.display = "none";
					document.getElementById("fieldEmail").style.display = "none";
					document.getElementById("fieldPassword").style.display = "block";
					document.getElementById("imgUser").style.backgroundImage = "url('uploads/"+usuario.perfil+"')";
					document.getElementById("password").focus();
					verificarEmail = true;
				}else{
					document.getElementById("progress").style.display = "none";
					document.getElementById("lEmail").setAttribute("data-error", "Não foi possível encontrar sua conta");
					document.getElementById("email").setAttribute("class", "validate invalid");
				}
			});
			request.fail(function (jqXHR, textStatus, errorThrown){
				console.error(
					"The following error occurred: "+
					textStatus, errorThrown
					);
			});
		}else{
			document.getElementById("email").focus();
			document.getElementById("lEmail").setAttribute("data-error","E-mail Invalido");
			document.getElementById("email").setAttribute("class", "validate invalid");

		}
	}
	function verificaEmailCadastro(){
		var email = document.getElementById("emailUser").value;
		if(email.indexOf("@") >= 0 && email.indexOf(".com") >= 0 ){
			request = $.ajax({
				url: "php/consultaEmail.php",
				type: "post",
				data: "email="+email
			});
			request.done(function (response, textStatus, jqXHR){
				if(response != "0"){
					document.getElementById("emailUser").focus();
					document.getElementById("lEmailUser").setAttribute("data-error","E-mail já possui cadastro");
					document.getElementById("emailUser").setAttribute("class", "validate invalid");
					validaEmail = false;
				}else{
					validaEmail = true;
					//document.getElementById("senhaUser").focus();
				}
			});
			request.fail(function (jqXHR, textStatus, errorThrown){
				console.error(
					"The following error occurred: "+
					textStatus, errorThrown
					);
			});
		}else{
			document.getElementById("emailUser").focus();
			document.getElementById("lEmailUser").setAttribute("data-error","E-mail Invalido");
			document.getElementById("emailUser").setAttribute("class", "validate invalid");
		}
	}

	//Verifica a Senha 
	function verificaSenha(senha){
		document.getElementById("progress").style.display = "block";
		if(usuario.senha == senha){
			var conexao = document.getElementById("manterConectado").checked;
			document.getElementById("checkConect").innerHTML = "";
			document.getElementById("progress").style.display = "none";
			document.getElementById("password").value = "";
			document.getElementById("containerLogin").style.display = "none";
			startSession(conexao);
		}else{
			document.getElementById("password").value = "";
			document.getElementById("progress").style.display = "none";
			document.getElementById("password").setAttribute("class", "validate invalid");
			document.getElementById("password").focus();
		}
	}
	//checa se  tem error de digitação
	function validaEmailUser(email){
		var dominio = email.split("@");
		var subdominio = dominio[1].split(".");
		var error_subdominio = [];
		error_subdominio.push(["","mail","gmeil","gmal","gml","gmil","hotmeil","hot","yaho","yaoo","yao"],["con","cn","cm","co"],["b","or","og","rg"]);
		var result = 4;
		for(var i = 0; i < subdominio.length; i++){
			if(!error_subdominio[i].indexOf(subdominio[i])){
				result = i;
				break;
			}
		}
		switch(result){
			case 0: 
			document.getElementById("emailUser").focus();
			document.getElementById("lEmailUser").setAttribute("data-error","Possivel erro de digitação: hotmail,yahoo,gmail");
			document.getElementById("emailUser").setAttribute("class", "validate invalid");
			break;
			case 1:
			document.getElementById("emailUser").focus();
			document.getElementById("lEmailUser").setAttribute("data-error","Possivel erro de digitação: com");
			document.getElementById("emailUser").setAttribute("class", "validate invalid");
			break;
			case 2:
			document.getElementById("emailUser").focus();
			document.getElementById("lEmailUser").setAttribute("data-error","Possivel erro de digitação: br,org");
			document.getElementById("emailUser").setAttribute("class", "validate invalid");
			break;
		}

	}

	//inicia a sessao
	function startSession(conectado){
		request = $.ajax({
			url: "php/startSession.php",
			type: "get",
			data: "idusuario="+usuario.idusuario+"&conexao="+conectado
		});
		request.done(function (response, textStatus, jqXHR){
			//checa se o usuario esta logado
			verificaLogin();
			console.log("Sessao Iniciada");
		});
		request.fail(function (jqXHR, textStatus, errorThrown){
			console.error(
				"The following error occurred: "+
				textStatus, errorThrown
				);
		});
	}
	//verifica se esta logado
	function verificaLogin(){
		request = $.ajax({
			url: "php/checkSession.php",
			type: "post"
		});
		request.done(function(response, textStatus, jqXHR){
			usuario = JSON.parse(response);
			if(usuario !=  "0"){
				document.getElementById("containerLogin").style.display = "none";
				incluirPainel();
			}else{
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
				document.getElementById("email").addEventListener("keypress", function(){
					if(event.keyCode == 13) login();
				});
				document.getElementById("password").addEventListener("keypress", function(){
					if(event.keyCode == 13) login();
				});
				document.getElementById("logar").addEventListener("click",function(){
					login();
				});	
				
				/*
				document.getElementById("cadastro").addEventListener("click",function(){
					cadastro();
				});
				document.getElementById("nome").addEventListener("keydown",function(){
					EnterTab('sobrenome',event);
				});
				document.getElementById("sobrenome").addEventListener("keydown",function(){
					EnterTab('emailUser',event)
				});
				document.getElementById("emailUser").addEventListener("keydown",function(){
					if(event.keyCode == 13) verificaEmailCadastro();
				});
				document.getElementById("salvaUsuario").addEventListener("click",function(){
					salvaUsuario();
				});

				document.getElementById("file").addEventListener("change",function(){
					var img;
					var  input = document.getElementById("file");
					if (input.files && input.files[0]) {
						var reader = new FileReader();
						reader.onload = function (e) {
							img = new FormData(input);
							document.getElementById("imgNewUser").style.backgroundImage = "url('"+e.target.result+"')";
							document.getElementById("nome").focus();
						}
						reader.readAsDataURL(input.files[0]);
					} 
				});*/
			}
			console.log("Sessao Verificada");
		});
		request.fail(function (jqXHR, textStatus, errorThrown){
			console.error(
				"The following error occurred: "+
				textStatus, errorThrown
				);
		});
	}
	//logout
	function logout(){
		request = $.ajax({
			url: "php/logout.php",
			type: "post"
		});
		request.done(function (response, textStatus, jqXHR){
			desativar();
			verificaLogin();
			console.log("Verificando Login");
		});	
	}
	//Chama a tela de cadastro
	function cadastro(){
		document.getElementById("nameLogin").innerHTML = "<h4>Cadastro</h4>";
		document.getElementById("fLogin").style.display = "none";
		document.getElementById("fCadastro").style.display = "block";
		document.getElementById("nome").focus();
	}

	function EnterTab(InputId,Evento){
		if(Evento.keyCode == 13){		
			document.getElementById(InputId).focus();
		}
	}
	
	//Salva o usuario
	function salvaUsuario(){
		var x = document.getElementById("file");
		var file_data =x.files[0];
		var form_data = new FormData();
			// form_data.append('file', file_data);
			form_data.append('tipoUsuario',  $('#tipoUsuario').val());
			form_data.append('nome',  $('#nome').val());
			form_data.append('email', $('#emailUserNovo').val());
			form_data.append('cpf', $('#cpf').val());
			form_data.append('telefone', $('#telefone').val());
			$.ajax({
				type:"POST",
				url:"php/salvaUsuario.php",
				data: form_data, 
				contentType: false,       // The content type used when sending data to the server.
				cache: false,             // To unable request pages to be cached
				processData:false,    	// Data sent to server, a set of key/value pairs (i.e. form fields and values)
				success: function(data) {
					document.getElementById('nome').value = "";
					document.getElementById('emailUserNovo').value = "";
					document.getElementById('cpf').value = "";
					document.getElementById('telefone').value = "";
					alert("Usuario salvo com sucesso");
				}
			});

		}
		function salvaNegociacao(){
			var form_data = new FormData();
			
			if(cliente == null){
				alert("SELECIONE O USUARIO");
				return;
			}
			if($('#produtos_negociacao').val() == null){
				alert("SELECIONE O PRODUTO");
				return;
			}
			if(removeMascara($('#precoproduto').val()) == 0 ||  $('#precoproduto').val().length == 0){
				alert("INFORME O VALOR DO PRODUTO");
				return;
			}
			form_data.append('idusuario',  cliente);
			form_data.append('idproduto', $('#produtos_negociacao').val());
			form_data.append('valor', removeMascara($('#precoproduto').val()));

			$.ajax({
				type:"POST",
				url:"php/salvaNegociacao.php",
			type: "POST",             // Type of request to be send, called as method
			data: form_data, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
			contentType: false,       // The content type used when sending data to the server.
			cache: false,             // To unable request pages to be cached
			processData:false,        // To send DOMDocument or non processed data file it is set to false
			success: function(data) {
				mostraProdutosCliente(cliente);
			}
		});
		}

		function incluirPainel(){
			document.getElementById("container").style.display = "block";
			$(document).ready(function(){
				$('.collapsible').collapsible();
				$('.modal').modal();
				$(".button-collapse").sideNav();
				$('select').material_select();

			});
			initConfiguracao();

		}
		verificaLogin();

		function consultaPermissoes(){
			if(usuario.tipo != "GERENTE"){
				$.ajax({
					url: "php/getPermissoes.php",
					type:"POST",
					data:{"idusuario": usuario.idusuario},
					success: function (json){
						var permissoes = JSON.parse(json);
						for(var i = 0; i < permissoes.length; i++){
							if(permissoes[i].idpermissao == 1){
								document.getElementById("menu_pedidos").style.display = "block";
							}
							if(permissoes[i].idpermissao == 2){
								document.getElementById("menu_cadastros").style.display = "block";
							}
							if(permissoes[i].idpermissao == 3){
								document.getElementById("menu_negociacao").style.display = "block";
							}
							if(permissoes[i].idpermissao == 4){
								document.getElementById("menu_configuracao").style.display = "block";
							}
							console.log(i);
						}

					}
				});
			}else{
				document.getElementById("menu_cadastros").style.display = "block";
				document.getElementById("menu_pedidos").style.display = "block";
				document.getElementById("menu_negociacao").style.display = "block";
				document.getElementById("menu_configuracao").style.display = "block";
				document.getElementById("btnConfiguracao").style.display = "block";
				document.getElementById("btnConfiguracaoMobile").style.display = "block";
			}
		}
		todosProdutos();
		function todosProdutos(){
			$.ajax({
				url: "php/todosProdutos.php",
				type:"POST",
				success: function (json){
					produtos = JSON.parse(json);
					var selects = "<option value='' disabled selected>SELECIONE UM PRODUTO</option>";
					for (var i = 0;i < produtos.length; i++) {
						selects += "<option value='"+produtos[i].idproduto+"' >"+produtos[i].descricao.toUpperCase()+"</option>";
					}
					document.getElementById("produtos_negociacao").innerHTML = selects;

					console.log(document.getElementById("produtos_negociacao").innerHTML);
				}
			});
		}
	//tras todos os produtos
	function mostraProdutos(){
		$.ajax({
			url: "php/todosProdutosPedidos.php",
			type:"POST",
			success: function (json){
				var result = JSON.parse(json);
				var item = "";
				for(var i = 0; i < result.length; i++){
					var img = "";
					item += '<a href="#tabelapedido" id="'+result[i].idproduto+'" class="collection-item modal-trigger modalitem"><span class="badge">'+result[i].qtdePedido+'</span>'+result[i].descricao.toUpperCase()+'</a>';
				}
				document.getElementById("produtos").innerHTML = item;
				$(".modalitem").click(function(){
					for(var i = 0; i < result.length; i++){
						var produto = result[i].orcamentos;
						var descricao = result[i].descricao;
						if(result[i].idproduto == this.id){
							item = "";
							for(var j = 0; j < produto.length; j++){
								item += "<tr><td>"+produto[j].idorcamento+"</td><td>"+produto[j].usuario.toUpperCase()+"</td><td>"+descricao.toUpperCase()+"</td><td>"+produto[j].qtde+"</td></tr>";
							}
							document.getElementById("produtos_orcamentos").innerHTML = item;
							break;
						}
					}
				});
				
				$('.modal').modal();
			}
		});
	}
	mostraProdutos();
	//Mostra o produtos do cliente na tabela
	function mostraProdutosCliente(idusuario){
		$.ajax({
			url: "php/getProdutosCliente.php",
			type:"POST",
			data: {"idusuario": idusuario},
			success: function (json){
				var result = JSON.parse(json);
				var rows = "";
				for (var i = 0; i < result.length; i++) {
					rows += "<tr><td>"+result[i].descricao.toUpperCase()+"</td><td style='text-align:right'>"+numberToReal(result[i].valor)+"</td></tr>"
				}
				document.getElementById("detalhe_negociacao").innerHTML = rows;
			}
		}); 
	}
	//Incluir os produtos do cliente dentro do select
	function selectProdutoCliente(idusuario,select){
		$.ajax({
			url: "php/getProdutosCliente.php",
			type:"POST",
			data: {"idusuario": idusuario},
			success: function (json){
				var result = JSON.parse(json);
				produtoCliente = result;
				var selects = "<option value='' disabled selected>SELECIONE UM PRODUTO</option>";
				for (var i = 0;i < result.length; i++) {
					selects += "<option value='"+i+"' >"+result[i].descricao.toUpperCase()+"</option>";
				}
				document.getElementById(select).innerHTML = selects;		
				$('select').material_select();		
			}
		}); 
	}


//Ativa as Configuração de Layout e Eventos
function initConfiguracao(){
	request = $.ajax({
		url: "php/configuracao.php",
		type: "POST"
	});
	request.done(function (response, textStatus, jqXHR){
			//pega a configuração e colocar e jogar na tela
			config = JSON.parse(response);
			document.getElementById("menu_painel").style.background = config.cor_menu;
			document.getElementById("conteudo_painel").style.background = config.cor_conteudo;
			document.getElementById("container").style.background = config.cor_fundo;
			document.getElementsByTagName("body")[0].style.background = config.cor_fundo;
			document.getElementById("logo").src = "assets/icon/"+config.logo;
			document.title = config.nome_empresa;
			preencheClientes("clientes_negociacao");

			//tela de configuracao de layout
			document.getElementById("btnConfiguracao").addEventListener("click",function(){
				abrirConfiguracao();
			});
			//logout
			document.getElementById("logout").addEventListener("click",function(){
				logout();
			});
			//abri as configuração de cores da tela
			document.getElementById("btnConfiguracaoMobile").addEventListener("click",function(){
				$('.button-collapse').sideNav('hide');
				abrirConfiguracao();
			});
		 	//Faz logout 
		 	document.getElementById("logoutMobile").addEventListener("click",function(){
		 		$('.button-collapse').sideNav('hide');
		 		logout();
		 	});

		 	//CADASTRO E PERMISSÕES
		 	document.getElementById("btnPermissoes").addEventListener("click",function(){
		 		document.getElementById("permissoes_users").style.display = "block";
		 		document.getElementById("cadastro_users").style.display = "none";
		 	});
		 	document.getElementById("btnUsuario").addEventListener("click",function(){
		 		document.getElementById("cadastro_users").style.display = "block";
		 		document.getElementById("permissoes_users").style.display = "none";
		 	});

		 	// Salva o Usuario 
		 	document.getElementById("btnSalvaUsuario").addEventListener("click",function(){
		 		salvaUsuario();
		 	});

		 	//HABILITA O FORMULARIO DE PEDIDO 
		 	document.getElementById("btnOrcamento").addEventListener("click",function(){
		 		document.getElementById("criar_orcamento").style.display = "block";
		 		document.getElementById("todosOrcamento").style.display = "none";
		 		preencheClientes("clientes");
		 	});
		 	//ADICIONA O ITEM NA LISTA DE ITENS DO PEDIDO
		 	document.getElementById("btnAdicionarItem").addEventListener("click",function(){
		 		var item = new Object();
		 		item.produto = produtoCliente[$("#produtos_pedido").val()];
		 		if(item.produto != null){
		 			item.qtde = $("#qtde").val();
		 			item.total = item.produto.valor * item.qtde;
		 			var existe = false;
		 				//CHECA SE O ITEM JÁ EXISTE
		 				var total = 0;
		 				for(var i = 0; i < itensOrcamento.length; i++){
		 					if(itensOrcamento[i].produto.idproduto == item.produto.idproduto){
		 						itensOrcamento[i] = item;
		 						existe = true;
		 					}
		 					total = total + itensOrcamento[i].total;
		 				}
		 				//SE NÃO EXISTIR ELE ADICIONA
		 				if(existe == false){
		 					total = total + item.total;
		 					itensOrcamento.push(item);
		 					var itens = document.getElementById("detalhe_pedido").innerHTML;
		 					itens += "<tr><td>"+item.produto.descricao.toUpperCase()+"</td><td>"+item.qtde+"</td><td>"+numberToReal(item.produto.valor)+"</td><td>"+numberToReal(item.total)+"</td><td><img src='assets/icon/remove.png'></td></tr>"
		 					document.getElementById("detalhe_pedido").innerHTML = itens;
		 					document.getElementById("totalpedido").value = numberToReal(total);
		 				}else{
		 					//SE EXISTIR ELE REFAZ A TABELA E ALTERAR OS VALORES DO ITEM
		 					document.getElementById("detalhe_pedido").innerHTML = "";
		 					total = 0;
		 					for(var i = 0 ; i < itensOrcamento.length; i++){
		 						var itens = document.getElementById("detalhe_pedido").innerHTML;
		 						itens += "<tr><td>"+itensOrcamento[i].produto.descricao.toUpperCase()+"</td><td>"+itensOrcamento[i].qtde+"</td><td>"+numberToReal(itensOrcamento[i].produto.valor)+"</td><td>"+numberToReal(itensOrcamento[i].total)+"</td><td><img src='assets/icon/remove.png'></td></tr>"
		 						document.getElementById("detalhe_pedido").innerHTML = itens;
		 						total = total+ parseFloat(itensOrcamento[i].total);
		 					}
		 					document.getElementById("totalpedido").value = numberToReal(total);
		 				}
		 				document.getElementById("btnSalvaOrcamento").style.display = "block";
		 			}
		 		});

		 		//salva o orcamento
		 		document.getElementById("btnSalvaOrcamento").addEventListener("click",function(){
		 			var orcamento = new Object();
		 			orcamento.usuario = cliente;
		 			orcamento.funcionario = funcionario;
		 			var total = document.getElementById("totalpedido").value;
		 			total = total.replace(",",".");  
		 			orcamento.total = parseFloat(total);
		 			orcamento.itens = itensOrcamento;
		 			console.log(orcamento);
		 			var dado = JSON.stringify(orcamento);
		 			$.ajax({
		 				url: "php/salvaOrcamento.php",
		 				type:"POST",
		 				data: {"dado":dado},
		 				success: function (json){
		 					alert("orcamento salvo com sucesso !");
		 					$(".autocliente").val("");
		 					$(".autocomplete").val("");
		 					document.getElementById("detalhe_pedido").innerHTML = "";
		 					document.getElementById("preconegociado").value = "";
		 					document.getElementById("totalpedido").value = "";
		 					document.getElementById("produtos_pedido").innerHTML = "<option value='' disabled selected>SELECIONE UM PRODUTO</option>";
		 					
		 				}
		 			});

		 			
		 		});

		 		document.getElementById("verOrcamentos").addEventListener("click",function(){
		 			document.getElementById("todosOrcamento").style.display = "block";
		 			document.getElementById("criar_orcamento").style.display = "none";
		 			$.ajax({
		 				url: "php/getOrcamentos.php",
		 				type:"POST",
		 				success: function (json){
		 					var result = JSON.parse(json);
		 					var listaorcamentos = "";
		 					for(var i = 0; i < result.length; i++){
		 						listaorcamentos += '<div class="col s12 m3 l3">';
		 						listaorcamentos += '<div class="card">';
		 						listaorcamentos += '<div class="card-content">';
		 						listaorcamentos += '<span class="card-title">'+result[i].nome.toUpperCase()+'</span>';
		 						listaorcamentos += '</div>';
		 						listaorcamentos += '<div class="card-action" style="text-align: right;padding: 5% 0px;">';
		 						listaorcamentos += '<a style="padding: 5%;margin: 0;background-color: #e55050;color: #fff;">'+numberToReal(result[i].total)+'</a>';
		 						listaorcamentos += '</div>';
		 						listaorcamentos += '</div>';
		 						listaorcamentos += '</div>';
		 					}
		 					document.getElementById("todosOrcamento").innerHTML = listaorcamentos;
		 				}
		 			});
		 		});

		 	//	TRAS OS PRODUTOS NEGOCIADO DO CLIENTE PARA A TABELA 
		 	$.ajax({
		 		url: "php/getClientes.php",
		 		type:"POST",
		 		success: function (json){
		 			var result = JSON.parse(json);
		 			clientes = result;
		 			var nomes = {};
		 			for (var i = 0;i < result.length; i++) {
		 				nomes[result[i].nome.toUpperCase()] = result[i].idusuario;
		 			}
		 			$('input.autoclientenegociacao').autocomplete({
		 				data: nomes,
			    	limit: 100, // The max amount of results that can be shown at once. Default: Infinity.
			    	onAutocomplete: function(val) {
			    		cliente = nomes[val];
			    		mostraProdutosCliente(cliente,"detalhe_negociacao");
			    	},
				    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
				});
		 		}
		 	});

			//Mascara Moeda no Campo
			$("input#precoproduto").maskMoney({showSymbol:true, symbol:"R$", decimal:",", thousands:"."});
			
			//salva a negociacao 
			document.getElementById("btnSalvaNegociacao").addEventListener("click",function(){
				salvaNegociacao();
			});


			todosFuncionarios();
			consultaPermissoes();

			document.getElementById("salvaPermissoes").addEventListener("click",function(){
				var permissoes = new Object();
				permissoes.idusuario = funcionario;
				if(document.getElementById("chpedido").checked == true){
					permissoes.pedido = "1";
				}
				if(document.getElementById("chcadasto").checked == true){
					permissoes.cadastro = "2";
				}
				if(document.getElementById("chnegoc").checked == true){
					permissoes.negoc = "3";
				}
				if(document.getElementById("chconfi").checked == true){
					permissoes.confi = "4";
				}
				var dado = JSON.stringify(permissoes);

				$.ajax({
					url: "php/permissoesUsuario.php",
					type:"POST",
					data: {"dado":dado},
					success: function (json){
						alert("permissoes salva com sucesso !");
					}
				});
				
			});

		});

request.fail(function (jqXHR, textStatus, errorThrown){
	console.error(
		"The following error occurred: "+
		textStatus, errorThrown
		);
});
}

	//preenche o select com os clientes
	function preencheClientes(select){
		$.ajax({
			url: "php/getClientes.php",
			type:"POST",
			success: function (json){
				var result = JSON.parse(json);
				clientes = result;
				var nomes = {};
				for (var i = 0;i < result.length; i++) {
					nomes[result[i].nome] = result[i].idusuario;
				}
				$('input.autocliente').autocomplete({
					data: nomes,
			    	limit: 100, // The max amount of results that can be shown at once. Default: Infinity.
			    	onAutocomplete: function(val) {
			    		cliente = nomes[val];
			    		selectProdutoCliente(cliente,"produtos_pedido");

			    		$('#produtos_pedido').on('change', function(e) {
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
	function todosFuncionarios(){
		$.ajax({
			url: "php/getFuncionarios.php",
			type:"POST",
			success: function (json){
				var users = JSON.parse(json);
				var nomes = {};
				for (var i = 0; i < users.length; i++) {
					nomes[users[i].nome] = users[i].idusuario;	
				}
				$('input.autocomplete').autocomplete({
					data: nomes,
			    	limit: 100, // The max amount of results that can be shown at once. Default: Infinity.
			    	onAutocomplete: function(val) {
			    		funcionario = nomes[val];
			    		getPermissoes(funcionario);	
			    	},
				    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
				});
			}
		});
	}

	function getPermissoes(idusuario){
		$.ajax({
			url: "php/getPermissoes.php",
			type:"POST",
			data:{"idusuario": idusuario},
			success: function (json){
				var permissoes = JSON.parse(json);
				for(var i = 0; i < permissoes.length; i++){
					if(permissoes[i].idpermissao == 1){
						document.getElementById("chpedido").checked  = true;
					}
					if(permissoes[i].idpermissao == 2){
						document.getElementById("chcadasto").checked = true;
					}
					if(permissoes[i].idpermissao == 3){
						document.getElementById("chnegoc").checked = true;
					}
					if(permissoes[i].idpermissao == 4){
						document.getElementById("chconfi").checked ==  true;
					}
				}
				
			}
		});
	}

	//Habilitar a tela de configuração de layout do usuario
	function abrirConfiguracao(){
		document.getElementById("configuracao").style.display = "block";
		document.getElementById("cor_menu").value = config.cor_menu;
		document.getElementById("cor_fundo").value = config.cor_fundo;
		document.getElementById("cor_conteudo").value = config.cor_conteudo;
		document.getElementById("nome_empresa").value = config.nome_empresa;
		document.getElementById("cor_menu").addEventListener("change",function(){
			document.getElementById("menu_painel").style.background = document.getElementById("cor_menu").value;
		});
		document.getElementById("cor_conteudo").addEventListener("change",function(){
			document.getElementById("conteudo_painel").style.background = document.getElementById("cor_conteudo").value;
		});
		document.getElementById("cor_fundo").addEventListener("change",function(){
			document.getElementById("container").style.background = document.getElementById("cor_fundo").value;
			document.getElementsByTagName("body")[0].style.background = document.getElementById("cor_fundo").value;
		});
		document.getElementById("btnSalvaConfig").addEventListener("click",function(){
			var file_data = document.getElementById("fileLogo").files[0];
			var form_data = new FormData();
			form_data.append('file', file_data);
			form_data.append('cor_fundo',  document.getElementById("cor_fundo").value);
			form_data.append('cor_conteudo', document.getElementById("cor_conteudo").value);
			form_data.append('cor_menu', document.getElementById("cor_menu").value);
			form_data.append('nome_empresa', document.getElementById("nome_empresa").value);
			request = $.ajax({
				type:"POST",
				url:"php/salvaConfiguracao.php",
						type: "POST",             // Type of request to be send, called as method
						data: form_data, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
						contentType: false,       // The content type used when sending data to the server.
						cache: false,             // To unable request pages to be cached
						processData:false,        // To send DOMDocument or non processed data file it is set to false
						success: function(data) {
							document.getElementById("configuracao").style.display = "none";
							document.title = document.getElementById("nome_empresa").value;
						}
					});
		});
		document.getElementById("fileLogo").addEventListener("change",function(){
			var img;
			var  input = document.getElementById("fileLogo");
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				reader.onload = function (e) {
					img = new FormData(input);
					document.getElementById("logo").src = ""+e.target.result;
					document.getElementById("nome").focus();
				}
				reader.readAsDataURL(input.files[0]);
			} 
		});
		document.getElementById("cancelar").addEventListener("click",function(){
			document.getElementById("configuracao").style.display = "none";
		});
	}
	function desativar(){
		document.getElementById("configuracao").style.display = "none";
		document.getElementById("container").style.display = "none";
		document.getElementById("criar_orcamento").style.display = "none";
		document.getElementById("menu_cadastros").style.display = "none";
		document.getElementById("menu_pedidos").style.display = "none";
		document.getElementById("menu_negociacao").style.display = "none";
		document.getElementById("menu_configuracao").style.display = "none";
		document.getElementById("btnConfiguracao").style.display = "none";
		document.getElementById("btnConfiguracaoMobile").style.display = "none";
		document.getElementById("permissoes_users").style.display = "none";
		document.getElementById("criar_orcamento").style.display = "none";
		document.getElementById("btnSalvaOrcamento").style.display = "none";
		document.getElementById("configuracao").style.display = "none";
	}
	//remove a mascara moeda do valor
	function removeMascara(valor){
		valor = valor.replace(".","");
		valor = valor.replace(",",".");
		return parseFloat(valor);  
	}

	function numberToReal(num) {
		var numero = parseFloat(num);
		var numero = numero.toFixed(2).split('.');
		numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
		return numero.join(',');
	}


}