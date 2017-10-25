<?php
    require_once "conexao.php";
    $id=$_POST['id'];
    mysqli_query($con,"UPDATE NET_MOVIMENTO SET NET_A_STATUS='CANCELADO' WHERE NET_PKN_SEQUENCIAL='$id'");
?>