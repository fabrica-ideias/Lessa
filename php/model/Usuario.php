<?php
class Usuario{
    var $idusuario;
    var $nome;
    var $email;
    var $senha;
    var $perfil;

    function setUsuario($dados){
    	$this->idusuario = $dados['idusuario'];
    	$this->nome = $dados['nome'];
    	$this->email = $dados['email'];
    	$this->senha = $dados['senha'];
        $this->perfil = $dados['perfil'];

    }

    function setIdusuario($idusurio){
    	$this->idusuario = $idusuario;
    }
    function getIdusuario(){
    	return $this->idusuario;
    }

    function setNome($nome){
    	$this->nome = $nome;
    }
    function getNome(){
    	return $this->nome;
    }
    function setEmail($email){
    	$this->email = $email;
    }
    function getEmail(){
        return  $this->email;
    }
    function setSenha($senha){
    	$this->senha = $senha;
    }
    function getSenha(){
        return $this->senha;
    }
    function setPerfil($perfil){
        $this->perfil = $perfil;
    }
    function getPerfil(){
        return $this->perfil;
    }
}
?>