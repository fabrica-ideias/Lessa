<?php
    require_once "conexao.php";
    $codigo = $_POST['codigo'];

    $dados = "PAR_PKN_CODIGO,PAR_A_RAZAOSOCIAL,PAR_A_NOME,PAR_A_NOME_FANTASIA,PAR_A_ENDERECO,TAB_PKN_CODIGO";

    $cliente = mysqli_fetch_array(mysqli_query($con,"SELECT $dados FROM `TB_PAR_PARTICIPANTE` WHERE `PAR_PKN_CODIGO`='$codigo'"));

    echo json_encode($cliente,JSON_UNESCAPED_UNICODE);
?>