var RaboPages = {

    saldo: function () {


        var deferred = $.Deferred();
        var saldoUrl = 'https://mb.rabobank.nl/saldo'
        var saldoWindow = window.open(saldoUrl, '_blank', 'location=no,hidden=yes,toolbar=no'); 

        saldoWindow.addEventListener('loadstop', function() {
          saldoWindow.executeScript(
            { code:"var getTagValue = function(){var elm = document.getElementsByTagName('h3')[0]; return { doc : elm.innerHTML };};" },
            function() {
              saldoWindow.executeScript(
                { code:'getTagValue()' },
                function(values){
                    var data = values[0];
                    // alert(data.doc);
                    // data is opgehaald, browser sluiten.
                    saldoWindow.close();
                    deferred.resolve(data.doc);
                });
            }
          );
        });

        $(saldoWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            //alert('loadstart : ' + url);
            // als de pagina toestel registreren langs komt -> browser laten zien.
            if(url == 'https://mb.rabobank.nl/static/online/toestelregistreren.html'){
                //alert('eerst registreren');
                saldoWindow.show();
            }
        });

        return deferred.promise();
    }
};

var initialize = {
    setupControls: function () {
        var $saldoCheck = $('#saldocheck');
        var $saldoStatus = $('#saldostatus p');
        $saldoCheck.on('click', function() 
        {
            $saldoStatus.html('Ophalen saldo..');
            RaboPages.saldo().done(function(data) 
            {
                var saldoTags = data;
                $saldoStatus.html(saldoTags);

            }).fail(function(data) 
            {
                //$saldoStatus.html(data.error);
            });
        });

    }
};
