<?php
class Negociacao{
    var $idnegociacao;
    var $idusuario;
    var $idproduto;
    var $valor;
    function setConfiguracao($dados){
    	$this->idnegociacao = $dados['idnegociacao'];
    	$this->idusuario = $dados['idusuario'];
    	$this->idproduto = $dados['idproduto'];
    	$this->valor = $dados['valor'];
    }

    function setIdnegociacao($idnegociacao){
    	$this->idnegociacao = $idnegociacao;
    }
    function getIdnegociacao(){
    	return $this->idnegociacao;
    }

    function setIdusuario($idusuario){
    	$this->idusuario = $idusuario;
    }
    function getIdusuario(){
    	return $this->idusuario;
    }
    function setIdproduto($idproduto){
    	$this->idproduto = $idproduto;
    }
    function getIdproduto(){
        return  $this->idproduto;
    }
    function setValor($valor){
    	$this->valor = $valor;
    }
    function getValor(){
        return $this->valor;
    }
}
?>