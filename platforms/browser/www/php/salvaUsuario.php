<?php
	require_once("uploadImage.php");
	require_once("conexao.php");
	require_once("model/fachada.class.php");
  	$fachada = new Fachada();
  	$usuario = new Usuario();
  	if(isset($_FILES['file'])){
  		$usuario->setPerfil(uploadImage($_FILES['file']));
  	}
  	$usuario->setNome($_POST['nome']);
	$usuario->setEmail($_POST['email']);
	$usuario->setCpf($_POST['cpf']);
	$usuario->setTelefone($_POST['telefone']);
	$usuario->setTipo($_POST['tipoUsuario']);
	$fachada->salvaUsuario($usuario);
?>