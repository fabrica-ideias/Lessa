<?php 
	date_default_timezone_set('America/Sao_Paulo');
	require_once("model/fachada.class.php");
	function registerLog($idusuario, $info){
		$fachada = new Fachada();
		$usuario = $fachada->getUsuarioPorId($_SESSION['idusuario']);
		$fp = fopen("../logs/".$idusuario."-".$usuario->getNome().".txt", "a"); 
		$escreve = fwrite($fp, date("d/m/Y H:i")." ".$info."\n");
		fclose($fp);
	};
?>