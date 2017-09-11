<?php session_start(); ?>
<!DOCTYPE html>
<html >
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="utf-8"/>
	<title>Login</title>
	<!-- Compiled and minified CSS -->
  	<link rel="stylesheet" href="materialize/css/materialize.min.css">
  	<!-- Compiled and minified JavaScript -->
  	<link rel="stylesheet" href="css/login.css" />
  	<link href="css/icon.css" rel="stylesheet">
  	<link rel="stylesheet" href="css/style.css" />
  	<link rel="stylesheet" type="text/css" href="css/font_roboto.css"/>
  	<script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
  	<script src="js/jquery-ui.js"></script>
  	<script src="materialize/js/materialize.min.js"></script>
	<script src="js/login.js" type="text/javascript"></script>
</head>
<body onload="initLogin()">
	<!-- Login -->
	<div class="row" id="containerLogin">
	 <div class="col s12 m4 l4"></div>
		<div class="col s12 m12 l4" id="form">
		    <form method="POST" class="col s12 m12 l12" id="fLogin">
			    <div class="row">
					<div class="col s4 m5 l4"></div>
					<div class="col s4 m2 l4 z-depth-4" id="imgUser"></div>
					<div class="col s4 m5 l4"></div>
				</div>	
			 	<div id="nameLogin"></div>
			 	<div class="progress" id="progress">
			    	<div class="indeterminate"></div>
			  	</div>
			    <div class="row" id="fieldEmail">
			        <div class="input-field col s12">
			          	<input id="email"  type="email"  class="validate" required="true" />
			          	<label for="email" id="lEmail" data-error="E-mail Invalido" >E-mail</label>
			        </div>
			    </div>
			    <div class="row" id="fieldPassword">
			        <div class="input-field col s12">
			       		<input id="password" type="password" class="validate"/>
			       	   	<label for="password" data-error="Senha incorreta">Senha</label>
			        </div>
			    </div>
			    <div class="row">
		    		<div class="col s12" id="checkConect" style="margin-bottom: 5px"></div>
			    	<a  class="s12 btn" id="logar" style="margin-bottom: 5px">PRÓXIMO</a>
			        <div class="col s12"><a  id="cadastro" style="margin-bottom: 5px">Cadastre-se</a></div>
			    </div>		
		    </form>
		    <?php require_once("cadastro.php");?>
		</div>
		<div class="col s12 m4 l4"></div>
	</div>

	<!-- Painel de Controlle -->
	<div class="row" id="container">
		<nav class="nav-extended" id="menu_painel">
			<div class="nav-wrapper">
				<img src="" height="100%" id="logo" class="brand-logo">
				 <a href="#" id="mobile" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
			      <ul id="nav-mobile" class="right hide-on-med-and-down">
			        <li><a id="btnConfiguracao" href="#">Configuração</a></li>
					<li><a id="logout" href="#">Sair</a></li>
			      </ul>
				 <ul class="side-nav" id="mobile-demo">
					<li><a id="btnConfiguracaoMobile" href="#">Configuração</a></li>
					<li><a id="logoutMobile" href="#">Sair</a></li>
				</ul>
			</div>
			<ul class="tabs tabs-transparent">
				<li class="tab"><a class="active" href="#home">HOME</a></li>
				<li class="tab"><a href="#taxis">PEDIDOS</a></li>
				<li class="tab"><a href="#cadastros">CADASTRO</a></li>
				<li class="tab"><a href="#negociacao">NEGOCIAÇÃO</a></li>
				<li class="tab"><a href="#configuracoes">CONFIGURAÇÕES</a></li>
			</ul>
		</nav>	
		<div class="row">
			<div class="col l1"></div>
			<div class="col s12 l10" id="conteudo_painel">
				<!-- HOME PRODUTOS -->
				<div id="home" class="col s12">
					<div class="row" id="produtos">         
					</div>
				</div>
				<!-- PEDIDOS -->
				<div id="taxis" class="col s12">
					<div class="row">
						<ul class="col s6 l2 collapsible" data-collapsible="accordion">
							<li><div class="collapsible-header" id="btnOrcamento">Orcamento</div></li>
							<li><div class="collapsible-header">Ver Orcamentos</div></li>
						</ul>
						<form id="criar_orcamento" class="col l10">
							<div class="col s1"></div>
							 <div class="col s10">
							    <select id="clientes">
							      	 
							    </select>
							  </div>
						</form>
					</div>
				</div>
				<!-- Cadastro -->
				<div id="cadastros" class="col s12">
					<div class="row">
						<ul class="col s6 l2 collapsible" data-collapsible="accordion">
							<li><div class="collapsible-header">Cliente</div></li>
							<li><div class="collapsible-header">Produto</div></li>
						</ul>
					</div>
				</div>
				<div id="negociacao" class="col s12">
					<div class="row">					
					  <div class="input-field col s12">
					    <select id="clientes_negociacao">
					      <option value="" disabled selected>SELECIONE UM CLIENTE</option>
					    </select>
					    <label>Cliente</label>
					  </div>

					</div>
				</div>
				<div id="configuracoes" class="col s12">CONFIGURAÇÕES</div>
			</div>
			<div class="col l1"></div>
		</div>


		<!-- Opções de Configuração de Layout -->
		<div class="row" >
				<div class="col s12">
					<div class="configuracao" id="configuracao">
						<a id="cancelar">X</a>
						<div class="col s4">
							<p>Nome da Empresa</p><input type="text" id="nome_empresa"/>
							<p>Cor do Menu</p><input type="color" id="cor_menu"/>
							<p>Cor do Painel de Conteudo</p><input type="color" id="cor_conteudo"/>
							<p>Cor do Fundo</p><input type="color" id="cor_fundo"/>
						</div>
						<div class="col s8 l4">
							<form action="#">
								<div class="file-field input-field">
									<div class="btn">
										<span>File</span>
										<input type="file" accept="image/*" class="fileImg" name="file" id="file">
									</div>
									<div class="file-path-wrapper">
										<input type="file" accept="image/*" class="fileImg" name="fileLogo" id="fileLogo">
										<input class="file-path validate" type="text" placeholder="Upload one or more files">
									</div>
								</div>
							</form>
							<div class="col s2 l5"></div>
							<button class="col s8 l2 btn" id="btnSalvaConfig">Salvar</button>
							<div class="col s2 l5"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body> 
</html>