<?php
	session_start();
	require_once("log.php");
	registerLog($_SESSION['idusuario']," - saiu do sistema.");
	unset($_SESSION['idusuario']);
	setcookie('idusuario');
?>