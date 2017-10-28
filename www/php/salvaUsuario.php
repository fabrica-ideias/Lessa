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
	$usuario->setSenha(base64_encode($_POST['senha']));
	$usuario->setIdPermissao($_POST['permissao']);
	if($_POST['permissao'] != 4){
        $usuario->setCodfuncionario($_POST['codusuario']);
    }else{
        $usuario->setCodParticipante($_POST['codusuario']);
    }
    $fachada->salvaUsuario($usuario);
?>