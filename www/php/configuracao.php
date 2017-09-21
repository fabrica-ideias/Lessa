<?php
	include("conexao.php");
	require_once("model/fachada.class.php");
	$fachada = new fachada();
	echo $fachada->getConfiguracao();
?>