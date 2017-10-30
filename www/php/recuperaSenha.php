<?php
require_once "model/fachada.class.php";
$fachada = new Fachada();
$email = $_GET['email'];

$user = $fachada->getUsuarioPorEmail($email);
if ($user != null) {
    $fachada->enviarEmail($email,$user);
    echo "ENVIADO";
} else {
    echo "NÃO ENVIADO";
}
?>