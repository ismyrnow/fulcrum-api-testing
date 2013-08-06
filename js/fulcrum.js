//requires jQuery, Leaflet

var fulcrum = {};

fulcrum.options = {
    'apiKey':'',
    'apiURL': "https://api.fulcrumapp.com/api/v2/",
    'debug': true,
    'mapDiv':'map',
    'mapCenter': [37.52,-77.43],
    'mapZoom': 11
};

fulcrum.fulcrumappRequest = function(restNoun, callback){
    $.ajax({
        url:fulcrum.options.apiURL + restNoun,
        type: "GET",
        success: callback
    });
}

fulcrum.init=function(options){
    fulcrum.options = $.extend(fulcrum.options, options);

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (fulcrum.isFulcrumRequest(settings.url)) {
                //only send the api key if its going to the fulcrum site.
                xhr.setRequestHeader("X-ApiToken", fulcrum.options.apiKey);
            }
        }
    });

    fulcrum.map = fulcrum.setUpMap();

    if (fulcrum.options.debug){
        fulcrum.get_records_debug();
    }else{
        fulcrum.get_records();
    }

}

fulcrum.isFulcrumRequest = function(url){
    //return true if request is going to fulcrumapp.com else fasle
    domain =  url.split('//')[1]
    if (domain){
        return domain.substring(0, 18) == "api.fulcrumapp.com";
    } else {
        return false
    }

}

fulcrum.setUpMap = function(){
    var options = fulcrum.options
    var map = L.map(options.mapDiv).setView(options.mapCenter, options.mapZoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    return map
}

fulcrum.get_users = function(){
    return fulcrum.fulcrumappRequest('users', fulcrum.parseUsers);
}

fulcrum.get_records = function(){
    fulcrum.fulcrumappRequest('records', fulcrum.parseRecords);
}

fulcrum.get_records_debug = function(){
    $.ajax({
        url: 'sources/records.json',
        type: "GET",
        success: fulcrum.parseRecords
    });
}

//parsing callbacks

fulcrum.parseUsers = function(users){
    console.log(users);
}

fulcrum.buildPopup = function (record){
    html = "<h4>" + record.id + "</h4><br/>";
    html += "<b>Project: </b>" + record.project_id + "</br>";
    html += "<b>Last updated: </b>" + record.client_updated_at + "</br>";
    return html
}

fulcrum.parseRecords = function(page){
    total_records = page.total_count;
    $('#hud').text('Number of Records: ' + total_records);

    $.each(page.records, function(n, record){
        console.log(record);
        incident = L.marker([record.latitude, record.longitude]).addTo(fulcrum.map)
            .bindPopup(fulcrum.buildPopup(record));
    });
}