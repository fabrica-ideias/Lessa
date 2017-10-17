<?php
$con = mysqli_connect("192.168.15.4", "root", "fi2108", "lessa");
if (!$con) {
    die('Erro ao conectar ao banco: ' . mysql_error());
}
$con->set_charset("utf8");



?>