<?php
class Login{
    var $idlogin;
    var $email;
    var $senha;
    var $nome;
    var $perfil;
    var $idpermissao;
    var $codparticipante;

    function setLogin($dados){
    	include("conexao.php");
        $this->idlogin = $dados['idlogin'];
    	$this->email = $dados['email'];
    	$this->senha = $dados['senha'];
        $this->nome = $dados['nome'];
        $this->perfil = $dados['perfil'];
        $this->idpermissao = $dados['idpermissao'];
        $this->codparticipante = $dados['codparticipante'];
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
    function setNome($nome){
        $this->nome = $nome;
    }
    function getNome(){
        return $this->nome;
    }
    function setPerfil($perfil){
        $this->perfil = $perfil;
    }
    function getPerfil(){
        return $this->perfil;
    }
    function setIdPermissao($idpermissao){
        $this->idpermissao = $idpermissao;
    }
    function getIdPermissao(){
        return $this->idpermissao;
    }
    function setCodParticipante($codparticipante){
        $this->codparticipante = $codparticipante;
    }
    function getCodParticipante(){
        return $this->codparticipante;
    }
}
?>