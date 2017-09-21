<?php
class Configuracao{
    var $idconfig;
    var $cor_fundo;
    var $cor_menu;
    var $cor_conteudo;
    var $logo;
    var $nome_empresa;
    function setConfiguracao($dados){
    	$this->idconfig = $dados['idconfig'];
    	$this->cor_fundo = $dados['cor_fundo'];
    	$this->cor_menu = $dados['cor_menu'];
    	$this->cor_conteudo = $dados['cor_conteudo'];
        $this->logo = $dados['logo'];
        $this->nome_empresa = $dados['nome_empresa'];
    }

    function setIdconfig($idconfig){
    	$this->idconfig = $idconfig;
    }
    function getIdconfig(){
    	return $this->idconfig;
    }

    function setCorFundo($cor_fundo){
    	$this->cor_fundo = $cor_fundo;
    }
    function getCorFundo(){
    	return $this->cor_fundo;
    }
    function setCorMenu($cor_menu){
    	$this->cor_menu = $cor_menu;
    }
    function getCorMenu(){
        return  $this->cor_menu;
    }
    function setCorConteudo($cor_conteudo){
    	$this->cor_conteudo = $cor_conteudo;
    }
    function getCorConteudo(){
        return $this->cor_conteudo;
    }
    function setLogo($logo){
        $this->logo = $logo;
    }
    function getLogo(){
        return $this->logo;
    }
    function setNomeEmpresa($nome_empresa){
        $this->nome_empresa = $nome_empresa;
    }
    function getNomeEmpresa(){
        return $this->nome_empresa;
    }
}
?>