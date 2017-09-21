<?php
	include("conexao.php");
	$email = $_GET['email'];
	$pwd = $_GET['pwd'];
	 $result = mysqli_query($con,"select * from usuario where email='$email' and senha='$pwd'");
	if( mysqli_num_rows($result)){
		echo json_encode(mysqli_fetch_array($result));
	}else{
		echo "0";
	}
?>