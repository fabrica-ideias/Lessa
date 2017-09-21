<?php
	include("conexao.php");
	require_once("model/fachada.class.php");
	$email = $_POST['email'];
	$fachada =  new Fachada();
	$fachada->getUsuarioEmail($email);
?>