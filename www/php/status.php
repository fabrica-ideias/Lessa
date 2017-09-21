<?php 
	require_once("model/fachada.class.php");
	if(isset($_GET['status'])){
		$num_taxi = $_GET['taxi'];
		$status = $_GET['status'];
		$dispositivo = $_GET['dispositivo'];
		$fachada = new fachada();
		if($status == "on"){
			$fachada->alteraStatusTaxi($num_taxi,"presente",$dispositivo);
		}
		if($status == "off"){
			$fachada->alteraStatusTaxi($num_taxi,"ausente",$dispositivo);
		}
	}
?>