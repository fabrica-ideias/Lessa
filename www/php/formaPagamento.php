<?php
    require_once "conexao.php";
    $result = mysqli_query($con,"SELECT item.* FROM TB_FOR_FORMA_PGTO as item , TB_PFO_PARTICIPANTE_FORMA as forma
        WHERE forma.PAR_PKN_CODIGO = item.FOR_PKN_CODIGO and forma.FOR_PKN_CODIGO = '".$_GET['id']."'");

    $formas = [];
    while ($row = mysqli_fetch_array($result)){
        $formas[] = $row;
    }
    echo json_encode($formas);
?>