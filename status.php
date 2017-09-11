<?php 
	if(isset($_GET['status'])){
		if($_GET['status'] == "on"){
			$taxi = $_GET['taxi'];
			$fila = json_decode(file_get_contents('arquivo.json'));

		}
	}
?>