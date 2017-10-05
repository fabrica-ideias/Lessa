<?php
require 'vendor/autoload.php';

//instancie o objeto
$app = new \Slim\Slim();

//defina a rota
$app->get('/', function () {
  echo "teste";
});
/*
$data = $args['data'];
$image = @file_get_contents("http://localhost/main/media/image/p/$data");
if($image === FALSE) {
  $handler = $this->notFoundHandler;
  return $handler($request, $response); */
//rode a aplicação Slim
$app->run(); 
?>