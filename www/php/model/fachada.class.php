<?php
require_once("model/Usuario.class.php");
require_once("model/Login.class.php");
require_once("model/Configuracao.class.php");
require_once("model/Negociacao.class.php");

class Fachada
{

    function getUsuarioPorId($idusuario)
    {
        include("conexao.php");
        $result = mysqli_query($con, "select * from login where idlogin='$idusuario'");
        if (mysqli_num_rows($result) > 0) {
            $dados = mysqli_fetch_array($result);
            $login = new Login();
            $login->setLogin($dados);
            return $login;
        }
        mysqli_close($con);
        return null;
    }

    function getUsuarioEmail($email, $senha)
    {
        include("conexao.php");
        $result = mysqli_query($con, "select * from login where email='$email' and senha = '$senha'");
        if (mysqli_num_rows($result)) {
            $dados = mysqli_fetch_array($result);
            echo json_encode($dados);
        } else {
            echo "0";
        }
        mysqli_close($con);
    }

    function getUsuarioPorEmail($email)
    {
        include("conexao.php");
        $result = mysqli_query($con, "select * from login where email='$email'");
        if (mysqli_num_rows($result)) {
            $dados = mysqli_fetch_array($result);

            return $dados;
        } else {
            return null;
        }
        mysqli_close($con);
    }

    function getClientes()
    {
        include("conexao.php");
        $result = mysqli_query($con, "SELECT 
			PAR_PKN_CODIGO,
			PAR_A_RAZAOSOCIAL,
			PAR_A_NOME,
			PAR_A_NOME_FANTASIA,
			PAR_A_LOGRADOURO,
			PAR_A_ENDERECO,
			PAR_A_NUMERO,
			PAR_A_BAIRRO,
			PAR_A_CIDADE,
			PAR_A_CNPJ_CPF,
			TAB_PKN_CODIGO
			
			FROM TB_PAR_PARTICIPANTE ORDER BY PAR_A_RAZAOSOCIAL ASC");
        $clientes = [];
        while ($dados = mysqli_fetch_array($result)) {
            $clientes[] = $dados;
        }
        echo json_encode($clientes, JSON_UNESCAPED_UNICODE);
        mysqli_close($con);
    }

    function getFuncionarios()
    {
        include("conexao.php");
        $result = mysqli_query($con, "select * from TB_FUN_FUNCIONARIO ORDER BY FUN_A_NOME");
        if (mysqli_num_rows($result)) {
            $funcionario = array();
            while ($dados = mysqli_fetch_array($result)) {
                $funcionario[] = $dados;
            }
            echo json_encode($funcionario, JSON_UNESCAPED_UNICODE);
        } else {
            echo "0";
        }
        mysqli_close($con);
    }

    function salvaUsuario($usuario)
    {
        include("conexao.php");
        if (!mysqli_query($con, "insert into login (nome,email,senha,idpermissao,codparticipante,codfuncionario) values ('" . $usuario->getNome() . "','" . $usuario->getEmail() . "','" . $usuario->getSenha() . "','" . $usuario->getIdPermissao() . "','" . $usuario->getCodParticipante() . "','" . $usuario->getCodfuncionario() . "')")) {
            echo "Error :" . mysqli_error($con);
        }
        echo "0";
        mysqli_close($con);
    }

    function salvaConfiguracao($config)
    {
        include("conexao.php");
        mysqli_query($con, "UPDATE configuracao SET cor_fundo = '$config->cor_fundo',
 				cor_conteudo = '$config->cor_conteudo', cor_menu = '$config->cor_menu', 
 				nome_empresa='$config->nome_empresa' , filial_empresa='$config->filial_empresa',
 				forma_pagamento=$config->forma_pagamento,mostra_preco=$config->mostra_preco
 				  WHERE idconfig='1'");
        echo "ok";
        mysqli_close($con);
    }

    function getConfiguracao()
    {
        include("conexao.php");
        $result = mysqli_query($con, "select * from configuracao where idconfig='1'");
        if (mysqli_num_rows($result) > 0) {
            $dados = mysqli_fetch_array($result);
            return json_encode($dados);
        }
        mysqli_close($con);
        return null;
    }

    function startSession($manterConectado, $session, $valor)
    {
        session_start();
        $_SESSION[$session] = $valor;
        if ($manterConectado == "true") {
            setcookie($session, $_SESSION[$session], PHP_INT_MAX);
        }
    }

    function getProdutos()
    {
        include("conexao.php");
        $produtos = array();
        $query = mysqli_query($con, "SELECT * FROM TB_PRO_PRODUTO");
        while ($dados = mysqli_fetch_array($query)) {
            $produtos[] = $dados;
        }
        echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
        mysqli_close($con);
    }

    function getProdutosOrcamentos()
    {
        include("conexao.php");
        $produtos = array();
        $query = mysqli_query($con, "SELECT * FROM produto ORDER BY descricao");
        while ($dados = mysqli_fetch_array($query)) {
            $produto = array();
            $produto['idproduto'] = $dados['idproduto'];
            $produto['descricao'] = $dados['descricao'];
            $produto['quantidade'] = $dados['quantidade'];
            $produto['qtdePedido'] = 0;
            $itens = mysqli_query($con, "SELECT * FROM itemorcamento WHERE idproduto='" . $dados['idproduto'] . "'");
            $orcamentos = array();
            while ($item = mysqli_fetch_array($itens)) {
                $orcamento = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM orcamento WHERE idorcamento='" . $item['idorcamento'] . "'"));
                $usuario = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM usuario WHERE idusuario='" . $orcamento['idusuario'] . "'"));

                $item['idorcamento'] = $orcamento['idorcamento'];
                $item['usuario'] = $usuario['nome'];
                $produto['qtdePedido'] += $item['qtde'];
                $produto['id'] = $item['iditem'];
                $orcamentos[] = $item;
            }
            $produto['orcamentos'] = $orcamentos;
            if ($produto['qtdePedido'] > 0) {
                $produtos[] = $produto;
            }
        }
        echo json_encode($produtos);
        mysqli_close($con);
    }

    function salvaNegociacao($negociacao)
    {
        include("conexao.php");

        $query = mysqli_query($con, "SELECT * FROM negociacao WHERE idusuario = '" . $negociacao->getIdUsuario() . "' AND idproduto = '" . $negociacao->getIdproduto() . "'");
        if (mysqli_num_rows($query) > 0) {
            mysqli_query($con, "update negociacao set valor = '" . $negociacao->getValor() . "' WHERE idusuario = '" . $negociacao->getIdUsuario() . "' AND idproduto = '" . $negociacao->getIdproduto() . "'");
            echo "0";
        } else {
            mysqli_query($con, "insert into negociacao (idusuario, idproduto, valor) values ('" . $negociacao->getIdUsuario() . "','" . $negociacao->getIdproduto() . "','" . $negociacao->getValor() . "')");
            echo "0";
        }
        mysqli_close($con);
    }

    function getProdutoCliente($codigo)
    {
        include("conexao.php");
        $result = mysqli_query($con, "SELECT prod.PRO_PKN_CODIGO,prod.PRO_A_DESCRICAO,
 				itbpreco.PRO_N_PRECO_VENDA_01_ITB, prod.PRO_A_UNIDADE
 				from TB_PRO_PRODUTO as prod,TB_ITB_PRECO_PAR as itbpreco where itbpreco.TAB_PKN_CODIGO = '$codigo' and prod.PRO_PKN_CODIGO = itbpreco.PRO_PKN_CODIGO ORDER BY PRO_A_DESCRICAO");
        $produtos = array();
        if (mysqli_num_rows($result) > 0 && $codigo != "null") {
            while ($dados = mysqli_fetch_array($result)) {
                $produto = [];
                $produto['idproduto'] = $dados['PRO_PKN_CODIGO'];
                $produto['descricao'] = $dados['PRO_A_DESCRICAO'];
                $produto['valor'] = $dados['PRO_N_PRECO_VENDA_01_ITB'];
                $produto['unidade'] = $dados['PRO_A_UNIDADE'];
                $produtos[] = $produto;
            }
            echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
        } else {
            $result = mysqli_query($con, "SELECT PRO_PKN_CODIGO,PRO_A_DESCRICAO,PRO_N_PRECO_VENDA_01,
 				PRO_A_UNIDADE FROM `TB_PRO_PRODUTO` ORDER BY `PRO_A_DESCRICAO` ASC");
            $produtos = array();
            while ($dados = mysqli_fetch_array($result)) {
                $produto = [];
                $produto['idproduto'] = $dados['PRO_PKN_CODIGO'];
                $produto['descricao'] = $dados['PRO_A_DESCRICAO'];
                $produto['valor'] = $dados['PRO_N_PRECO_VENDA_01'];
                $produto['unidade'] = $dados['PRO_A_UNIDADE'];
                $produtos[] = $produto;
            }
            echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
        }
        mysqli_close($con);
    }

    function getOrcamentos()
    {
        include("conexao.php");
        $result = mysqli_query($con, "SELECT * FROM NET_MOVIMENTO where STATUS_EXPORTACAO='false' and NET_A_STATUS = 'DIGITADO' OR NET_A_STATUS = 'PENDENTE'");
        $orcamentos = array();
        while ($dados = mysqli_fetch_array($result)) {
            $result2 = mysqli_query($con, "SELECT *  FROM NET_ITEM_MOVIMENTO WHERE NET_PKN_CODIGO='" . $dados['NET_PKN_SEQUENCIAL'] . "'");
            $itens = [];
            while ($item = mysqli_fetch_array($result2)) {
                $query = mysqli_query($con, "SELECT * FROM TB_PRO_PRODUTO where PRO_PKN_CODIGO = '" . $item['PRO_PKN_CODIGO'] . "'");
                $produto = mysqli_fetch_array($query);
                $item['descricao'] = $produto['PRO_A_DESCRICAO'];
                $item['unidade'] = $produto['PRO_A_UNIDADE'];
                $itens[] = $item;
            }
            $dados['itens'] = $itens;
            $orcamentos[] = $dados;
        }
        echo json_encode($orcamentos);
        mysqli_close($con);
    }

    function getOrcamentosFuncionario($id)
    {
        include("conexao.php");
        $result = mysqli_query($con, "SELECT * FROM NET_MOVIMENTO where STATUS_EXPORTACAO='false' and FUN_PKN_CODIGO='$id'  and NET_A_STATUS = 'DIGITADO' OR NET_A_STATUS = 'PENDENTE'");
        $orcamentos = array();
        while ($dados = mysqli_fetch_array($result)) {
            $result2 = mysqli_query($con, "SELECT *  FROM NET_ITEM_MOVIMENTO WHERE NET_PKN_CODIGO='" . $dados['NET_PKN_SEQUENCIAL'] . "'");
            $itens = [];
            while ($item = mysqli_fetch_array($result2)) {
                $query = mysqli_query($con, "SELECT * FROM TB_PRO_PRODUTO where PRO_PKN_CODIGO = '" . $item['PRO_PKN_CODIGO'] . "'");
                $produto = mysqli_fetch_array($query);
                $item['descricao'] = $produto['PRO_A_DESCRICAO'];
                $item['unidade'] = $produto['PRO_A_UNIDADE'];
                $itens[] = $item;
            }
            $dados['itens'] = $itens;
            $orcamentos[] = $dados;
        }
        echo json_encode($orcamentos);
        mysqli_close($con);
    }

    function getOrcamentosCliente($id)
    {
        include("conexao.php");
        $result = mysqli_query($con, "SELECT * FROM NET_MOVIMENTO where STATUS_EXPORTACAO='false' and PAR_PKN_CODIGO='$id'");
        $orcamentos = array();
        while ($dados = mysqli_fetch_array($result)) {
            $result2 = mysqli_query($con, "SELECT *  FROM NET_ITEM_MOVIMENTO WHERE NET_PKN_CODIGO='" . $dados['NET_PKN_SEQUENCIAL'] . "'");
            $itens = [];
            while ($item = mysqli_fetch_array($result2)) {
                $query = mysqli_query($con, "SELECT * FROM TB_PRO_PRODUTO where PRO_PKN_CODIGO = '" . $item['PRO_PKN_CODIGO'] . "'");
                $produto = mysqli_fetch_array($query);
                $item['descricao'] = $produto['PRO_A_DESCRICAO'];
                $item['unidade'] = $produto['PRO_A_UNIDADE'];
                $itens[] = $item;
            }
            $dados['itens'] = $itens;
            $orcamentos[] = $dados;
        }
        echo json_encode($orcamentos);
        mysqli_close($con);
    }

    function enviarEmail($email, $user)
    {
        $subject = "Lessa";
        $message = "seu acesso:" . base64_decode($user['senha']);
        $header = "From: Lessa <fabrica704@ftp.fabrica704.com.br>\r\n";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-Type: text/html; charset=utf-8\r\n";
        $header .= "X-Mailer: PHP/" . phpversion();
        $header .= "Reply-To: fabrica704@ftp.fabrica704.com.b\n";
        $header .= "X-Priority: 3\n";
        @mail($email, $subject, $message, $header);

    }
}

?>