<?php 
	//require_once("model/fachada.class.php");
	//$fachada = new Fachada();
	//$fachada->getClientes();

	require_once "conexao.php";
	$nome = $_POST['nome'];
	$clientes = [];
	$result = mysqli_query($con,"SELECT * FROM TB_PAR_PARTICIPANTE 
		WHERE PAR_A_RAZAOSOCIAL like '$nome%' ORDER BY PAR_A_RAZAOSOCIAL ASC LIMIT 5");

	$dados = [];
	while($row = $result->fetch_array()){
		$dados[] = $row;
	}
	echo json_encode($dados, JSON_UNESCAPED_UNICODE);
	mysqli_close($con);
?>