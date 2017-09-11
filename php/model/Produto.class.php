<?php 
	class Produto{
		var $idproduto;
		var $descricao;
		var $quantidade;
		var $preco;
		var $imgproduto;

		function setIdproduto($idproduto){
	    	$this->idproduto = $idproduto;
	    }
	    function getIdproduto(){
	    	return $this->idproduto;
	    }
	    function setDescricao($descricao){
	    	$this->descricao = $descricao;
	    }
	    function getDescricao(){
	    	return $this->descricao;
	    }
	    function setQuantidade($quantidade){
	    	$this->quantidade = $quantidade;
	    }
	    function getQuantidade(){
	    	return $this->quantidade;
	    }
	    function setPreco($preco){
	    	$this->preco = $preco;
	    }
	    function getPreco(){
	    	return $this->preco;
	    }
	    function setImgProduto($imgproduto){
	    	$this->imgproduto = $imgproduto;
	    }
	    function getImgProduto(){
	    	return $this->imgproduto;
	    }

	}
?>