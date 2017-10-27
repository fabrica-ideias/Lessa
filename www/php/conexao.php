<?php

date_default_timezone_set('America/Fortaleza');
$con = mysqli_connect("179.185.44.137", "root", "fi2108", "lessa");
if (!$con) {
    die('Erro ao conectar ao banco: ' . mysql_error());
}
$con->set_charset("utf8");
?>