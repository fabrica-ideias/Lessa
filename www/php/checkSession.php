<?php 
	session_start();
	require_once("log.php");
	require_once("model/fachada.class.php");;
	if(isset($_COOKIE['idusuario']) || isset($_SESSION['idusuario'])){
		if(isset($_COOKIE['idusuario'])){
			$_SESSION['idusuario'] = $_COOKIE['idusuario'];
		}
		$fachada =  new Fachada();
		echo json_encode($fachada->getUsuarioPorId($_SESSION['idusuario']));
		registerLog($_SESSION['idusuario']," - acesando o sistema.");
	}else{
		echo 0;
	}
?>