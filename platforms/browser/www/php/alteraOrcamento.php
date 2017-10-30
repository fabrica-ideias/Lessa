<?php
require_once("conexao.php");
$orcamento = json_decode($_POST['dado']);
mysqli_query($con, "DELETE FROM NET_ITEM_MOVIMENTO WHERE NET_PKN_CODIGO='".$orcamento->NET_PKN_SEQUENCIAL."'");

$data = date('Y-m-d');
$id = $orcamento->NET_PKN_SEQUENCIAL;
foreach ($orcamento->itens as $item) {
    mysqli_query($con, "INSERT INTO NET_ITEM_MOVIMENTO(PRO_PKN_CODIGO, NET_ITEM_QTD, NET_M_VALOR_UNITARIO, NET_PKN_CODIGO) VALUES ('" . $item->produto->idproduto . "','" . $item->qtde . "','" . $item->produto->valor . "','$id')");
}
mysqli_close($con);
echo "0";
?>