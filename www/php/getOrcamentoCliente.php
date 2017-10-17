<?php
require_once("model/fachada.class.php");
$fachada = new Fachada();
$fachada->getOrcamentosCliente($_POST['id']);
?>