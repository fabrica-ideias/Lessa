<?php
class Login{
    var $idlogin;
    var $email;
    var $senha;
    var $usuario;

    function setLogin($dados){
    	include("conexao.php");
        $this->idlogin = $dados['idlogin'];
    	$this->email = $dados['email'];
    	$this->senha = $dados['senha'];
        $this->usuario = new Usuario(mysqli_fetch_array(mysqli_query($con ,"select * from  TB_FUN_FUNCIONARIO where FUN_PKN_CODIGO='".$dados['codfuncionario']."'")));;
    }

    function setIdLogin($idlogin){
    	$this->idlogin = $idlogin;
    }
    function getIdLogin(){
    	return $this->idlogin;
    }
    function setEmail($email){
        $this->email = $email;
    }
    function getEmail(){
        return $this->email;
    }
    function setSenha($senha){
        $this->senha = $senha;
    }
    function getSenha(){
        return $this->senha;
    }
    function setUsuario($usuario){
        $this->usuario = $usuario;
    }
    function getUsuario(){
        return $this->usuario;
    }
}
?>