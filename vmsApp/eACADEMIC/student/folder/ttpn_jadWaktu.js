$(document).ready(function(){
    $('#btnPerincian').click(function(){
        console.log('btn perincian');
        $('#boxJadWaktu, #liRekodBaru').addClass('collapse');
        $('#boxPerincianJW').removeClass('collapse');
    });

    $('#btnKembali').click(function(){
        console.log('btn perincian');
        $('#boxJadWaktu, #liRekodBaru').removeClass('collapse');
        $('#boxPerincianJW').addClass('collapse');
    });
});