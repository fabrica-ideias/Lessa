<?php
	require_once("uploadImage.php");
	require_once("conexao.php");
	require_once("model/fachada.class.php");
  	$fachada = new Fachada();
  	$negociacao = new Negociacao();
  	
  	$negociacao->setIdusuario($_POST['idusuario']);
	$negociacao->setIdproduto($_POST['idproduto']);
	$negociacao->setValor($_POST['valor']);
	$fachada->salvaNegociacao($negociacao);
?>