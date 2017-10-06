<?php
class Usuario{
    var $idusuario;
    var $nome;
    var $perfil;
    var $cpf;
    var $telefone;
    var $tipo;
    var $codparticipante;

    function setUsuario($dados){
    	$this->idusuario = $dados['FUN_PKN_CODIGO'];
    	$this->nome = $dados['FUN_A_NOME'];
        $this->cpf = $dados['FUN_A_CPF'];
        $this->tipo = $dados['FUN_A_TIPOFUNCIONARIO'];
        $this->codparticipante = $dados['PAR_PKN_CODIGO'];
    }

    function setIdusuario($idusuario){
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
    function setPerfil($perfil){
        $this->perfil = $perfil;
    }
    function getPerfil(){
        return $this->perfil;
    }
    function setTipo($tipo){
        $this->tipo = $tipo;
    }
    function getTipo(){
        return $this->tipo;
    }
    function setCpf($cpf){
        $this->cpf = $cpf;
    }
    function getCpf(){
        return $this->cpf;
    }
    function setTelefone($telefone){
        $this->telefone = $telefone;
    }
    function getTelefone(){
        return $this->telefone;
    }
    function setCodParticipante($codparticipante){
        $this->codparticipante = $codparticipante;
    }
    function getCodParticipante(){
        return $this->codparticipante;
    }
}
?>