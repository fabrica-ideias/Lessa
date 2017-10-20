function EnterTab(InputId, Evento) {
    if (Evento.keyCode == 13) {
        document.getElementById(InputId).focus();
    }
}

//remove a mascara moeda do valor
function removeMascara(valor) {
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");
    return parseFloat(valor);
}

function numberToReal(num) {
    var numero = parseFloat(num);
    var numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}
function mascaraQuantidade(num) {
    var numero = parseFloat(num);
    var numero = numero.toFixed(3).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}

//formata de forma generica os campos
function formataCampo(campo, Mascara, evento) {
    var boleanoMascara;

    var Digitato = evento.keyCode;
    exp = /\-|\.|\/|\(|\)| /g
    campoSoNumeros = campo.value.toString().replace(exp, "");

    var posicaoCampo = 0;
    var NovoValorCampo = "";
    var TamanhoMascara = campoSoNumeros.length;
    ;

    if (Digitato != 8) { // backspace
        for (i = 0; i <= TamanhoMascara; i++) {
            boleanoMascara = ((Mascara.charAt(i) == "-") || (Mascara.charAt(i) == ".")
                || (Mascara.charAt(i) == "/"))
            boleanoMascara = boleanoMascara || ((Mascara.charAt(i) == "(")
                || (Mascara.charAt(i) == ")") || (Mascara.charAt(i) == " "))
            if (boleanoMascara) {
                NovoValorCampo += Mascara.charAt(i);
                TamanhoMascara++;
            } else {
                NovoValorCampo += campoSoNumeros.charAt(posicaoCampo);
                posicaoCampo++;
            }
        }
        campo.value = NovoValorCampo;
        return true;
    } else {
        return true;
    }
}
function verificaNovoEmail(email) {
    if (email.indexOf("@") < 0 || email.indexOf(".com") < 0) {
        Materialize.toast('E-MAIL INVALIDO', 4000);
        return false;
    }
    return true;
}
function hideKeyBoard(){
    var field = document.createElement('input');
    field.className = "keyfocus";
    field.setAttribute('type', 'text');
    document.body.appendChild(field);

    setTimeout(function() {
        field.focus();
        setTimeout(function() {
            field.setAttribute('style', 'display:none;');
        }, 1);
    }, 50);
}

function mudarCorElemento(nomeElemento, inputColor) {
    document.getElementById(nomeElemento).style.backgroundColor = document.getElementById(inputColor).value;
}

function habilitaPedido() {
    if (usuario.tipo == "GERENTE") {
        document.getElementById("criar_orcamento").style.display = "block";
    } else if (usuario.tipo == "FUNCIONARIO") {
        document.getElementById("funcionario_orcamento").style.display = "block";
        document.getElementById("selectCliente").style.display = "block";
    }
    document.getElementById("todosOrcamento").style.display = "none";
}

function verificaEmailCadastro(email) {
    if (email.indexOf("@") >= 0 && email.indexOf(".com") >= 0) {
        var request = new XMLHttpRequest();
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = function () {
            if (response != "0") {
                document.getElementById("emailUser").focus();
                document.getElementById("lEmailUser").setAttribute("data-error", "E-mail já possui cadastro");
                document.getElementById("emailUser").setAttribute("class", "validate invalid");
                validaEmail = false;
            } else {
                validaEmail = true;
            }
        }
        request.open("POST", url + "php/consultaEmail.php", true);
        request.send("email=" + email);
    } else {
        document.getElementById("emailUser").focus();
        document.getElementById("lEmailUser").setAttribute("data-error", "E-mail Invalido");
        document.getElementById("emailUser").setAttribute("class", "validate invalid");
    }
}
function validaEmailUser(email) {
    var dominio = email.split("@");
    var subdominio = dominio[1].split(".");
    var error_subdominio = [];
    error_subdominio.push(["", "mail", "gmeil", "gmal", "gml", "gmil", "hotmeil", "hot", "yaho", "yaoo", "yao"], ["con", "cn", "cm", "co"], ["b", "or", "og", "rg"]);
    var result = 4;
    for (var i = 0; i < subdominio.length; i++) {
        if (!error_subdominio[i].indexOf(subdominio[i])) {
            result = i;
            break;
        }
    }
    switch (result) {
        case 0:
            document.getElementById("emailUser").focus();
            document.getElementById("lEmailUser").setAttribute("data-error", "Possivel erro de digitação: hotmail,yahoo,gmail");
            document.getElementById("emailUser").setAttribute("class", "validate invalid");
            break;
        case 1:
            document.getElementById("emailUser").focus();
            document.getElementById("lEmailUser").setAttribute("data-error", "Possivel erro de digitação: com");
            document.getElementById("emailUser").setAttribute("class", "validate invalid");
            break;
        case 2:
            document.getElementById("emailUser").focus();
            document.getElementById("lEmailUser").setAttribute("data-error", "Possivel erro de digitação: br,org");
            document.getElementById("emailUser").setAttribute("class", "validate invalid");
            break;
    }

}
function dataAtualFormatada(d){
    var data = new Date(d);
    var dia = data.getDate();
    if (dia.toString().length == 1)
        dia = "0"+dia;
    var mes = data.getMonth()+1;
    if (mes.toString().length == 1)
        mes = "0"+mes;
    var ano = data.getFullYear();
    return dia+"/"+mes+"/"+ano;
}


