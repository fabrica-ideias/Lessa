<?php
    require_once "conexao.php";
    $codigo = $_POST['codigo'];

    $cliente = mysqli_fetch_array(mysqli_query($con,"SELECT * FROM `TB_PAR_PARTICIPANTE` WHERE `PAR_PKN_CODIGO`='$codigo'"));

    echo json_encode($cliente,JSON_UNESCAPED_UNICODE);
?>