<?php 
	require_once("model/fachada.class.php");
	$fachada = new Fachada();
	$fachada->getProdutoCliente($_POST['codigo']);
?>
