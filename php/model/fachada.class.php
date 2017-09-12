<?php 
require_once("model/Usuario.php");
require_once("model/Configuracao.class.php");
require_once("model/Negociacao.class.php");
class Fachada{	
		//Usuario
	function getUsuarioPorId($idusuario){
		include("conexao.php");
		$result = mysqli_query($con,"select * from usuario where idusuario='$idusuario'");
		if( mysqli_num_rows($result) > 0){
			$dados =  mysqli_fetch_array($result);
			$usuario = new Usuario();
			$usuario-> setUsuario($dados);
			return $usuario;
		}
		return null;
	}
	function getUsuarioEmail($email){
		include("conexao.php");
		$result = mysqli_query($con,"select * from usuario where email='$email'");
		if( mysqli_num_rows($result)){
			$dados =  mysqli_fetch_array($result);
			echo json_encode($dados);
		}else{
			echo "0";
		}
	}
	function getClientes(){
		include("conexao.php");
		$result = mysqli_query($con,"select * from usuario where tipo='CLIENTE'");
		if( mysqli_num_rows($result)){
			$clientes = array();
			while($dados= mysqli_fetch_array($result)){
				$clientes[] = $dados;
			}
			echo json_encode($clientes);
		}else{
			echo "0";
		}
	}

	function salvaUsuario($usuario){
		include("conexao.php");
		mysqli_query($con,"insert into usuario (nome,email,senha,perfil) values ('".$usuario->getNome()."','".$usuario->getEmail()."','".$usuario->getSenha()."','".$usuario->getPerfil()."')");
		$fachada = new Fachada();
		$fachada->startSession('false','idusuario',mysqli_insert_id($con));
		echo "0";
	}
	function salvaConfiguracao($config){
		include("conexao.php");
		mysqli_query($con,"UPDATE configuracao SET cor_fundo = '$config->cor_fundo', cor_conteudo = '$config->cor_conteudo', cor_menu = '$config->cor_menu', nome_empresa='$config->nome_empresa'  WHERE idconfig='1'");
		echo "ok";
	}
	function getConfiguracao(){
		include("conexao.php");
		$result = mysqli_query($con,"select * from configuracao where idconfig='1'");
		if( mysqli_num_rows($result) > 0){
			$dados =  mysqli_fetch_array($result);
			return json_encode($dados);
		}
		return null;
	}

	function startSession($manterConectado,$session,$valor){	
		session_start();
		$_SESSION[$session] = $valor;
		if($manterConectado == "true"){
			setcookie($session, $_SESSION[$session], PHP_INT_MAX);
		}
	}

	function getProdutos(){	
		include("conexao.php");
		$produtos = array();
		$query = mysqli_query($con,"SELECT * FROM produto");
		while($dados= mysqli_fetch_array($query)){
			$produtos[] = $dados;
		}
		echo json_encode($produtos);
	}
	function salvaNegociacao($negociacao){
		include("conexao.php");

		$query = mysqli_query($con,"SELECT * FROM negociacao WHERE idusuario = '".$negociacao->getIdUsuario()."' AND idproduto = '".$negociacao->getIdproduto()."'");
		if(mysqli_num_rows($query) > 0){
			mysqli_query($con,"update negociacao set valor = '".$negociacao->getValor()."' WHERE idusuario = '".$negociacao->getIdUsuario()."' AND idproduto = '".$negociacao->getIdproduto()."'");
			echo "0";
		}else{
			mysqli_query($con,"insert into negociacao (idusuario, idproduto, valor) values ('".$negociacao->getIdUsuario()."','".$negociacao->getIdproduto()."','".$negociacao->getValor()."')");
			echo "0";
		}
	}
	function getProdutoCliente($idusuario){
		include("conexao.php");
		$result = mysqli_query($con,"SELECT * FROM negociacao WHERE idusuario='$idusuario'");
		$produtos = array();
		while($dados= mysqli_fetch_array($result)){
			$dadoproduto = mysqli_fetch_array(mysqli_query($con,"SELECT * FROM produto WHERE idproduto = '".$dados['idproduto']."'"));
			$produto = [];
			$produto['idproduto'] = $dados['idproduto'];
			$produto['descricao'] = $dadoproduto['descricao'];
			$produto['valor'] = $dados['valor'];
			$produtos[] = $produto;
		}
		echo json_encode($produtos);
	}
}
?>