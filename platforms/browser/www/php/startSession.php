<?php 
session_start();
require_once("log.php");
$_SESSION['idusuario'] = $_GET['idusuario'];
if($_GET['conexao'] == "true"){
	setcookie('idusuario', $_SESSION['idusuario'], PHP_INT_MAX);
}
registerLog($_SESSION['idusuario']," - entrou no sistema.");
registerLog($_SESSION['idusuario']," - acesando o sistema.");

?>