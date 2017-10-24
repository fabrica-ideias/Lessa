<?php
	include("conexao.php");
	require_once("model/fachada.class.php");
	$email = $_POST['email'];
	$senha = $_POST['senha'];
	$fachada =  new Fachada();
	$fachada->getUsuarioEmail($email,$senha);
?>