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
function autocompleteeditado(autocomplete,states) {
    $(function () {
        var alreadyFilled = false;
        function initDialog() {
            clearDialog();
            for (var i = 0; i < states.length; i++) {
                $('.dialog').append('<div id="'+states[i].value+'">' + states[i].text + '</div>');
            }
        }

        function clearDialog() {
            $('.dialog').empty();
        }

        $(autocomplete+' input').click(function () {
            if (!alreadyFilled) {
                $('.dialog').addClass('open');
            }

        });
        $('body').on('click', '.dialog div', function () {
            $(autocomplete+' input').val($(this).text()).focus();
            $(autocomplete+' .close').addClass('visible');
            alert(this.id);
            alreadyFilled = true;
        });
        $(autocomplete+' .close').click(function () {
            alreadyFilled = false;
            $('.dialog').addClass('open');
            $(autocomplete+' input').val('').focus();
            $(this).removeClass('visible');
        });

        function match(str) {
            str = str.toLowerCase();
            clearDialog();
            for (var i = 0; i < states.length; i++) {
                if (states[i].text.toLowerCase().startsWith(str)) {
                    $('.dialog').append('<div id="'+states[i].value+'">' + states[i].text + '</div>');
                }
            }
        }

        $(autocomplete+' input').on('input', function () {
            $('.dialog').addClass('open');
            alreadyFilled = false;
            match($(this).val());
        });
        $('body').click(function (e) {
            if (!$(e.target).is("input, .close")) {
                $('.dialog').removeClass('open');
            }
        });
        initDialog();
    });
}