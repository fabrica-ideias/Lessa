<?php
    require_once("model/fachada.class.php");
    $fachada = new Fachada();
    $fachada->getOrcamentosFuncionario($_POST['id']);
?>