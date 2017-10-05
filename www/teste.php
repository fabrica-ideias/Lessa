<?php
//ABRE O ARQUIVO TXT
$ponteiro = fopen ("teste.txt","r");

while (!feof($ponteiro)) {
  $linha = fgets($ponteiro,4096);
  echo $linha.";<br>";
}
fclose ($ponteiro);
?>