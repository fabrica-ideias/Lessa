<?php
	require_once("conexao.php");
	$orcamento = json_decode($_POST['dado']);
	$data = date('Y-m-d');
	if(!mysqli_query($con,"INSERT INTO orcamento(idusuario, idfuncionario, data, total) VALUES ('$orcamento->usuario','$orcamento->funcionario','$data','$orcamento->total')")){
		 echo("Error description: " . mysqli_error($con));
	}

	$idorcamento = mysqli_insert_id($con);
	foreach ($orcamento->itens as $item) {
		$idproduto = $item->produto->idproduto;
		$qtde = $item->qtde;
		$valor = $item->produto->valor;
		if(!mysqli_query($con,"INSERT INTO itemorcamento(idproduto,qtde,valor,idorcamento) VALUES ('$idproduto','$qtde','$valor','$idorcamento')")){
			echo("Error description: " . mysqli_error($con));
		}
	}
?>