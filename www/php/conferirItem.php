<?php
require_once "conexao.php";
$idproduto = $_POST['iditem'];
$idpedido = $_POST['idpedido'];
$idconferente = $_POST['idconferente'];
mysqli_query($con,"UPDATE NET_ITEM_MOVIMENTO SET CONFERIDO=true,IDCONFERENTE='$idconferente' WHERE PRO_PKN_CODIGO='$idproduto' AND NET_PKN_CODIGO='$idpedido'");

$result = mysqli_query($con,"SELECT * FROM  NET_ITEM_MOVIMENTO WHERE CONFERIDO=false AND NET_PKN_CODIGO='$idpedido'");

if(mysqli_num_rows($result) == 0){
    mysqli_query($con,"UPDATE NET_MOVIMENTO SET NET_A_STATUS='CONFERIDO' WHERE NET_PKN_SEQUENCIAL='$idpedido'");
    echo "yes";
}else{
    mysqli_query($con,"UPDATE NET_MOVIMENTO SET NET_A_STATUS='PENDENTE' WHERE NET_PKN_SEQUENCIAL='$idpedido'");
    echo "no";
}
?>