<?php 
	require_once("conexao.php");
	$id = $_POST['idusuario'];
	$result = mysqli_query($con,"SELECT * FROM permissao WHERE idusuario='$id'");
	$permissoes = array();
	while($dado = mysqli_fetch_array($result)){
		$permissao = array();
		$permissao['idusuario'] = $dado['idusuario'];
		$permissao['idpermissao'] = $dado['idpermissao'];
		$permissoes[] = $permissao;
	}
	echo json_encode($permissoes);
?>
