var fulcrum = {};

fulcrum.options = {
    'apiKey':'',
    'mapDiv':'map',
    'mapCenter': [37.52,-77.43],
    'mapZoom': 11,
    'apiURL': "https://api.fulcrumapp.com/api/v2/"
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
    fulcrum.get_users();
}

fulcrum.isFulcrumRequest = function(url){
    //return true if request is going to fulcrumapp.com else fasle
    return url.split('//')[1].substring(0, 18) == "api.fulcrumapp.com";
}

fulcrum.setUpMap = function(){
    var options = fulcrum.options
    var map = L.map(options.mapDiv).setView(options.mapCenter, options.mapZoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    return map
}

fulcrum.parseUsers = function(users){
    console.log(users);
}

fulcrum.get_users = function(){
    return fulcrum.fulcrumappRequest('users', fulcrum.parseUsers);
}

