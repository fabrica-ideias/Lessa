<?php
	include("conexao.php");
	require_once("model/fachada.class.php");
	$email = $_POST['email'];
	$senha = base64_encode($_POST['senha']);
	$fachada =  new Fachada();
	$fachada->getUsuarioEmail($email,$senha);
?>