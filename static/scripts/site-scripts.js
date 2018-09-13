
// make REST API 'GET' call to the specified end-point and dump response in specified <div>
function doRestGet(endPoint, idStatusArea) {
    $('#' + idStatusArea).text('Waiting for response from Marketing Cloud...');
    $.ajax({
        type: "GET",
        url: endPoint,
        dataType: 'text',
    })
    .done (function (data, textStatus, jqXHR) {
        // success
        var successInfo = textStatus + '\n' + jqXHR.status + ' - ' + data; 
        $('#' + idStatusArea).text(successInfo);
    })
    .fail (function(jqXHR, textStatus, errorThrown) {
        // error
        var errorInfo = jqXHR.status + ' - ' + errorThrown + '\nException:\n' + jqXHR.responseText;
        $('#' + idStatusArea).text(errorInfo);
        console.log(errorInfo);
    });
}
