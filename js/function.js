function init(){
	var mostraTela = false;
	var id = 0;
	function checaOrdemDaFila(){
		request = $.ajax({
		        url: "php/verificarFila.php",
		        type: "post"
		});
		request.done(function (response, textStatus, jqXHR){
			JSON.parse(response);
			result = JSON.parse(response);
			if(id != result.id){
				id = result.id;
				mostraFila(result);
				if(mostraTela == true){
					if(document.getElementById("audio") != null){
						document.getElementById('audio').play();
					}
				}
				mostraTela = true;
			}

		});
		request.fail(function (jqXHR, textStatus, errorThrown){
		    console.error(
		        "The following error occurred: "+
		        textStatus, errorThrown
		    );
		});
	}
	function mostraFila(taxis){
		var filaPosto1 = [];
		var filaPosto2 = [];
		var filaPosto3 = [];
		for (var i = 0; i < taxis.posto1.length; i++) {
			filaPosto1.push(taxis.posto1[i]);
		}
		for (var i = 0; i < taxis.posto2.length; i++) {
			filaPosto2.push(taxis.posto2[i]);
		}
		for (var i = 0; i < taxis.posto3.length; i++) {
			filaPosto3.push(taxis.posto3[i]);
		}
		for (var i = 0; i < taxis.problemas.length; i++) {
			filaPosto3.push(taxis.problemas[i]);
		}
		
		preencherFilas(filaPosto1,"saida_posto1","fila_posto1",false);
		preencherFilas(filaPosto2,"saida_posto2","fila_posto2",false);
		preencherFilas(filaPosto3,"","fila_posto3",true);
	}
	function preencherFilas(taxis,saida,lista,restante){
		var fila = "";
		for (var i = 0; i < taxis.length; i++) {
			if(taxis[i] != null){
				if(i == 0 && restante == false){
					if(document.getElementById(saida) != null){
							document.getElementById(saida).innerHTML = taxis[i].numero;
					}
				}else{
					if(restante == false){
						fila += "<li style='width: 10%;color: #fff;background: #3aa13d;text-align: center;text-shadow: 2px 2px 5px #000;border-radius: 4px;box-shadow: 5px 5px 5px #b2b0b0;margin-bottom: 20px;' class='"+taxis[i].status+"'>"+taxis[i].numero+"</li>";
					}else{
						fila += "<li class='"+taxis[i].status+"'>"+taxis[i].numero+"</li>";
					}
				}
			}
		}
		if(document.getElementById(lista) != null){
			if(restante == false){
				fila = '<li><i style="background: #2b7bc7;padding: 5px;color: #fff;border-radius:100%;" class="small material-icons">arrow_back</i></li>'+fila;
			}
			document.getElementById(lista).innerHTML = fila;
		}
	}
	setInterval(function(){ 
		checaOrdemDaFila();
	},500);
	if(document.getElementById("proximo") != null){
		btnProxmoTaxi = document.getElementById("proximo");
		btnProxmoTaxi.addEventListener("click",function(){
			request = $.ajax({
			        url: "php/chamaTaxi.php",
			        type: "post"
			});
			request.done(function (response, textStatus, jqXHR){
				console.log(response);
				mostraFila(JSON.parse(response));

			});
			request.fail(function (jqXHR, textStatus, errorThrown){
			    console.error(
			        "The following error occurred: "+
			        textStatus, errorThrown
			    );
			});
		});
	}
	 $('.modal').modal();
}

function initOrdemFila(){
	console.log("iniciar ordenamento de lista");
	$(function() {
		var ordem = [];
	    $( "ul.filaordem" ).sortable();
	    $( "ul.filaordem" ).disableSelection();
	    $('.btnSalvaOrdem').click(function(){
	    	console.log("salva ordem fila");
	    	ordem = [];
		    $( "li" ).each(function( index ) {
				ordem.push($( this ).text());

			});
			request = $.ajax({
		        url: "php/ordenarLista.php",
		        type: "post",
		        data: {'ordem': JSON.stringify(ordem)}
			});
			request.done(function (response, textStatus, jqXHR){
				console.log(response);

			});
			request.fail(function (jqXHR, textStatus, errorThrown){
			    console.error(
			        "The following error occurred: "+
			        textStatus, errorThrown
			    );
			});
	    });

	});
}