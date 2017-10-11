<?php
require_once("conexao.php");
$orcamento = json_decode($_POST['dado']);
$data = date('Y-m-d');
if (!mysqli_query($con,"INSERT INTO NET_MOVIMENTO(
	NET_A_CLI_NOME,
	NET_A_CPF_CNPJ,
	NET_A_LOGRADOURO,
	NET_A_ENDERECO,
	NET_A_NUMERO,
	NET_A_FONE,
	NET_A_CELULAR,
	NET_A_CIDADE,
	NET_A_UF,
	NET_D_DATA_NASCIMENTO,
	NET_A_EMAIL,
	NET_A_STATUS,
	NET_A_OBS, 
	PAR_PKN_CODIGO,
	NET_D_DATA,
	FIL_PKN_CODIGO,
	 FUN_PKN_CODIGO,
	 FOR_PKN_CODIGO) 
	VALUES (
	'".$orcamento->usuario->PAR_A_RAZAOSOCIAL."','"
	.$orcamento->usuario->PAR_A_CNPJ_CPF."','"
	.$orcamento->usuario->PAR_A_LOGRADOURO."','"
	.$orcamento->usuario->PAR_A_ENDERECO."','"
	.$orcamento->usuario->PAR_A_NUMERO."','"
	.$orcamento->usuario->PAR_A_FONE1."', '"
	.$orcamento->usuario->PAR_A_FONE2."','"
	.$orcamento->usuario->PAR_A_CIDADE."','"
	.$orcamento->usuario->PAR_A_ESTADO."','"
	.$orcamento->usuario->PAR_D_ANIVERSARIO."','"
	.$orcamento->usuario->PAR_A_EMAIL."','"
	.$orcamento->usuario->PAR_A_STATUS."', '"
	.$orcamento->usuario->PAR_A_OBS_FINANCEIRA."', '"
	.$orcamento->usuario->PAR_PKN_CODIGO."','"
	.$data."','0','"
	.$orcamento->funcionario."',
	'".$orcamento->forma."')")){
	echo("Error description: " . mysqli_error($con));
}
$id =  mysqli_insert_id($con);
foreach ($orcamento->itens as $item) {
	mysqli_query($con,"INSERT INTO NET_ITEM_MOVIMENTO(PRO_PKN_CODIGO, NET_ITEM_QTD, NET_M_VALOR_UNITARIO, NET_PKN_CODIGO) VALUES ('".$item->produto->idproduto."','".$item->qtde."','".$item->produto->valor."','$id')");
}
	mysqli_close($con);
?>