<?php
require_once("model/Usuario.class.php");
require_once("model/Login.class.php");
require_once("model/Configuracao.class.php");
require_once("model/Negociacao.class.php");
class Fachada{

	function getUsuarioPorId($idusuario){
		include("conexao.php");
		$result = mysqli_query($con,"select * from login where idlogin='$idusuario'");
		if( mysqli_num_rows($result) > 0){
			$dados =  mysqli_fetch_array($result);
			$login = new Login();
			$login->setLogin($dados);
			return $login;
		}
		return null;
	}
	function getUsuarioEmail($email){
		include("conexao.php");
		$result = mysqli_query($con,"select * from login where email='$email'");
		if( mysqli_num_rows($result)){
			$dados =  mysqli_fetch_array($result);
			echo json_encode($dados);
		}else{
			echo "0";
		}
	}
	function getClientes(){
		include("conexao.php");
		mysqli_query($con,"SET NAMES 'utf8'");
		$result = mysqli_query($con,"SELECT * FROM TB_PAR_PARTICIPANTE ORDER BY PAR_A_RAZAOSOCIAL ASC") ;
		$clientes = [];
		while($dados= mysqli_fetch_array($result)){
			$clientes[] = $dados;
		}
		echo json_encode($clientes, JSON_UNESCAPED_UNICODE);
	}
	function getFuncionarios(){
		include("conexao.php");
		$result = mysqli_query($con,"select * from TB_PAR_PARTICIPANTE");
		if( mysqli_num_rows($result)){
			$funcionario = array();
			while($dados= mysqli_fetch_array($result)){
				$funcionario[] = $dados;
			}
			echo json_encode($funcionario, JSON_UNESCAPED_UNICODE);
		}else{
			echo "0";
		}
	}

	function salvaUsuario($usuario){
		include("conexao.php");
		if(!mysqli_query($con,"insert into login (nome,email,senha,idpermissao,codparticipante) values ('".$usuario->getNome()."','".$usuario->getEmail()."','".$usuario->getSenha()."','".$usuario->getIdPermissao()."','".$usuario->getCodParticipante()."')")){
			echo "Error :".mysqli_error($con);
		}
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
		$query = mysqli_query($con,"SELECT * FROM TB_PRO_PRODUTO");
		while($dados= mysqli_fetch_array($query)){
			$produtos[] = $dados;
		}
		echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
	}

	function getProdutosOrcamentos(){
		include("conexao.php");
		$produtos = array();
		$query = mysqli_query($con,"SELECT * FROM produto ORDER BY descricao");
		while($dados= mysqli_fetch_array($query)){
			$produto = array();
			$produto['idproduto'] = $dados['idproduto'];
			$produto['descricao'] = $dados['descricao'];
			$produto['quantidade'] = $dados['quantidade'];
			$produto['qtdePedido'] = 0;
			$itens = mysqli_query($con,"SELECT * FROM itemorcamento WHERE idproduto='".$dados['idproduto']."'");
			$orcamentos = array();
			while($item = mysqli_fetch_array($itens)){
				$orcamento = mysqli_fetch_array(mysqli_query($con,"SELECT * FROM orcamento WHERE idorcamento='".$item['idorcamento']."'"));
				$usuario = mysqli_fetch_array(mysqli_query($con,"SELECT * FROM usuario WHERE idusuario='".$orcamento['idusuario']."'"));

				$item['idorcamento'] = $orcamento['idorcamento'];
				$item['usuario'] = $usuario['nome'];
				$produto['qtdePedido'] += $item['qtde'];
				$produto['id'] = $item['iditem'];
				$orcamentos[] = $item;
			}
			$produto['orcamentos'] = $orcamentos;
			if($produto['qtdePedido'] > 0){
				$produtos[] = $produto;
			}
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
	function getProdutoCliente($codigo){
		include("conexao.php");
		$result = mysqli_query($con,"SELECT * from TB_PRO_PRODUTO as prod,TB_ITB_PRECO_PAR as itbpreco where itbpreco.TAB_PKN_CODIGO = '$codigo' and prod.PRO_PKN_CODIGO = itbpreco.PRO_PKN_CODIGO");
		$produtos = array();
		if(mysqli_num_rows($result) > 0){
			while($dados= mysqli_fetch_array($result)){
				$produto = [];
				$produto['idproduto'] = $dados['PRO_PKN_CODIGO'];
				$produto['descricao'] = $dados['PRO_A_DESCRICAO'];
				$produto['valor'] = $dados['PRO_N_PRECO_VENDA_01_ITB'];
				$produto['unidade'] = $dados['PRO_A_UNIDADE'];
				$produtos[] = $produto;
			}
			echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
		}else{
			$result = mysqli_query($con,"SELECT * FROM `TB_PRO_PRODUTO` ORDER BY `PRO_A_DESCRICAO` ASC");
			$produtos = array();
			while($dados= mysqli_fetch_array($result)){
				$produto = [];
				$produto['idproduto'] = $dados['PRO_PKN_CODIGO'];
				$produto['descricao'] = $dados['PRO_A_DESCRICAO'];
				$produto['valor'] = $dados['PRO_N_PRECO_VENDA_01'];
				$produto['unidade'] = $dados['PRO_A_UNIDADE'];
				$produtos[] = $produto;
			}
			echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
		}
	}
	function getOrcamentos(){
		include("conexao.php");
		$result = mysqli_query($con,"SELECT * FROM orcamento");
		$orcamentos = array();
		while($dados= mysqli_fetch_array($result)){
			$usuario = mysqli_fetch_array(mysqli_query($con,"SELECT * FROM usuario WHERE idusuario='".$dados['idusuario']."'"));
			$dados['nome'] = $usuario['nome'];
			$orcamentos[] = $dados;
		}
		echo json_encode($orcamentos);
	}
}
?>