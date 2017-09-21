<?php
	require_once("conexao.php");
	$permissao = json_decode($_POST['dado']);
	mysqli_query($con,"DELETE FROM permissao WHERE idusuario = '$permissao->idusuario'");
	if(isset($permissao->pedido)){
		mysqli_query($con,"INSERT INTO permissao(idusuario, idpermissao) VALUES ('$permissao->idusuario','$permissao->pedido')");
	}
	if(isset($permissao->cadastro)){
		mysqli_query($con,"INSERT INTO permissao(idusuario, idpermissao) VALUES ('$permissao->idusuario','$permissao->cadastro')");
	}
	if(isset($permissao->negoc)){
		mysqli_query($con,"INSERT INTO permissao(idusuario, idpermissao) VALUES ('$permissao->idusuario','$permissao->negoc')");
	}
	if(isset($permissao->confi)){
		mysqli_query($con,"INSERT INTO permissao(idusuario, idpermissao) VALUES ('$permissao->idusuario','$permissao->confi)");
	}
	echo "ok";
?>