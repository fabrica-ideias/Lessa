<?php
    require_once "conexao.php";
    $id=$_GET['id'];
    mysqli_query($con,"DELETE FROM NET_MOVIMENTO WHERE NET_PKN_SEQUENCIAL='$id'");
    mysqli_query($con,"DELETE FROM NET_ITEM_MOVIMENTO WHERE NET_PKN_CODIGO='$id'");
?>