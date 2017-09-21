<?php
	$fila = json_decode(file_get_contents('arquivo.json'));
	if($fila->alteracao == true){
		$fila->alteracao = false;
		$fp = fopen('arquivo.json', 'w');
		fwrite($fp, json_encode($fila));
		fclose($fp);	
	}
?>