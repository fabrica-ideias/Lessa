<?php
class Configuracao{
    var $idconfig;
    var $cor_fundo;
    var $cor_menu;
    var $cor_conteudo;
    var $logo;
    var $nome_empresa;
    var $filial_empresa;
    var $forma_pagamento;
    var $mostra_preco;

    function setConfiguracao($dados){
    	$this->idconfig = $dados['idconfig'];
    	$this->cor_fundo = $dados['cor_fundo'];
    	$this->cor_menu = $dados['cor_menu'];
    	$this->cor_conteudo = $dados['cor_conteudo'];
        $this->logo = $dados['logo'];
        $this->nome_empresa = $dados['nome_empresa'];
        $this->filial_empresa = $dados['filial_empresa'];
        $this->forma_pagamento = $dados['forma_pagamento'];
        $this->mostra_preco = $dados['mostra_preco'];
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
    public function getFilialEmpresa(){
        return $this->filial_empresa;
    }
    public function setFilialEmpresa($filial_empresa){
        $this->filial_empresa = $filial_empresa;
    }
    public function getFormaPagamento(){
        return $this->forma_pagamento;
    }
    public function setFormaPagamento($forma_pagamento){
        $this->forma_pagamento = $forma_pagamento;
    }
    public function getMostraPreco(){
        return $this->mostra_preco;
    }
    public function setMostraPreco($mostra_preco){
        $this->mostra_preco = $mostra_preco;
    }


}
?>