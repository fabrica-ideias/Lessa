<?php
	require_once("uploadImage.php");
	require_once("conexao.php");
	require_once("model/fachada.class.php");
  	$fachada = new Fachada();
  	$usuario = new Login();
  	if(isset($_FILES['file'])){
  		$usuario->setPerfil(uploadImage($_FILES['file']));
  	}
  	$usuario->setNome($_POST['nome']);
	$usuario->setEmail($_POST['email']);
	$usuario->setSenha($_POST['senha']);
	$usuario->setIdPermissao($_POST['permissao']);
	$usuario->setCodParticipante($_POST['codparticipante']);
	$fachada->salvaUsuario($usuario);
?>