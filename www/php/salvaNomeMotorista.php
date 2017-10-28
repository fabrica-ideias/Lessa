<?php
require_once "conexao.php";
$nome = $_POST['nome'];
$idpedido = $_POST['idpedido'];
    mysqli_query($con,"UPDATE NET_MOVIMENTO SET NET_A_MOTORISTA='$nome' WHERE NET_PKN_SEQUENCIAL='$idpedido'");
    echo "ok";
?>