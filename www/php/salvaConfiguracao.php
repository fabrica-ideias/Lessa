<?php 
	require_once("uploadLogo.php");
	require_once("conexao.php");
	require_once("model/fachada.class.php");
	if(isset($_FILES['file'])){
		uploadImage($_FILES['file']);
  	}
	$configuracao = new Configuracao();
	$configuracao->setCorFundo($_POST['cor_fundo']);
	$configuracao->setCorConteudo($_POST['cor_conteudo']);
	$configuracao->setCorMenu($_POST['cor_menu']);
	$configuracao->setNomeEmpresa($_POST['nome_empresa']);
	$configuracao->setFilialEmpresa($_POST['filial_empresa']);
	$configuracao->setFormaPagamento($_POST['forma_pagamento']);
	$configuracao->setMostraPreco($_POST['mostra_preco']);
	$fachada = new fachada();
	$fachada->salvaConfiguracao($configuracao);
?>