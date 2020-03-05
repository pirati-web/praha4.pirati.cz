

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getCSSObjectStyleProperty(n) {
  var result = 'default';
  if (window.CSS && window.CSS.supports && window.CSS.supports('--a', 0)) {
    result = 'var(' + n + ')';
  } else {
    result = getComputedStyle(document.body).getPropertyValue(n);
  }
  return result;
}
/*generate graph*/
function generateGraph(graphData, graphName, graphLegend) {
  var gnum = graphName.match(/\d/g);
  gnum = gnum ? gnum.join("") + '-' : '';
  var gvals = eval(graphData);
  var lvals = null;
  if (graphLegend) {
    lvals = graphLegend.replace('[', '').replace(']', '').split(',');
  }
  var max = Math.max.apply(Math, _toConsumableArray(gvals));
  max = Math.floor((max + 20) / 20) * 20;
  //var popupGraph = '<div>'+graphName+'.'+graphLegend+'</div>';
  var popupGraph = '<div class="chart">';
  popupGraph += '<div class="div-hr div-hr-0"></div>';
  popupGraph += '<div class="div-hr div-title div-title-0">0</div>';
  var j = max / 20;
  var l = j - 1;
  for (var i = 20; i <= max; i += 20) {
    var k = i > 99 ? 18 : 13;
    popupGraph += '<div class="div-hr" style="top: calc(100%/' + j + ' * ' + l + ');"></div>';
    popupGraph += '<div class="div-hr div-title" style="top: calc(100%/' + j + ' * ' + l + ' - 7%); right: ' + k + 'px;">' + i + '</div>';
    l--;
  }
  var barindex = 1;
  gvals.forEach(function (gval) {
    popupGraph += '<div class="bar" style="height: calc(' + (gval < 0 ? 0 : gval) + '%/' + max + ' * 100); background-color: ' + getCSSObjectStyleProperty('--bar-' + gnum + barindex) + '; border-bottom-color: ' + getCSSObjectStyleProperty('--bar-' + barindex) + ';" title="' + gval + '"></div>';
    //popupGraph += '<div class="bar" style="height: calc(' + (gval < 0 ? 0 : gval) + '%/' + max + ' * 100); background-color: var(--bar-' + gnum + barindex + '); border-bottom-color: var(--bar-' + barindex + ');" title="' + gval + '"></div>';
    barindex++;
  });
  popupGraph += '</div>';
  if (lvals && Array.isArray(lvals)) {
    popupGraph += '<div class="chart-legend">';
    var legendindex = 0;
    lvals.forEach(function (lval) {
      popupGraph += '<div class="bar-legend">' + lval + '</div>';
      legendindex++;
    });
    popupGraph += '</div>';
  }

  return popupGraph;
}


function urlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status != 404;
}


function loadjscssfile(filename, filetype) {
  if (filetype == "js") {
    //if filename is a external JavaScript file
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
  } else if (filetype == "css") {
    //if filename is an external CSS file
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  }
  if (typeof fileref != "undefined") document.getElementsByTagName("head")[0].appendChild(fileref);
}

// tile layer
var OSMpodklad = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 19,
  minZoom: 9,
  Opacity: .8
});

// GeoJson layer
var Useky = L.geoJson(null, {
  layerName: 'Useky',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.TYPZONY;
    if (density == 1) fillColor = "#77aaff";else if (density == 2) fillColor = "#f477ff";
      else if (density == 3) fillColor = "#ffbe11";else if (density == 4) fillColor = "#c2e699";
      else fillColor = "#f7f7f7"; // no data                               ;
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: .6 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("Tarif: <strong>" + feature.properties.TARIFTAB + "</strong><br/>" 
      //+ "object: " + feature.properties.LEVEL + "/" + feature.properties.NUMBER + "<br/>" 
      + "Technický úsek: " + feature.properties.ZPS_ID + "<br/>" 
      + "Kapacita: " //+ feature.properties.CELKEM_PS + " ZPS: " 
      + feature.properties.PS_ZPS + "<br/>" 
      //+ "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" 
      //+ "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>" 
      );
  }
});

var DATAMAP = L.geoJson(null, {
  layerName: 'DATAMAP',
  style: function style(feature) {
    var fillColor = "blue"; 
    if ($("input:radio[name=Zobrazit]:checked").val() == "OBSAZENOST" 
      && $("input:radio[name=Cas]:checked").val() == "DEN" ) 
        fillColor = getColor(feature.properties.Obs,'Obs');
    else if ($("input:radio[name=Zobrazit]:checked").val() == "OBSAZENOST" 
      && $("input:radio[name=Cas]:checked").val() == "NOC" ) 
        fillColor = getColor(feature.properties.ObsN,'Obs');  
    else if ($("input:radio[name=Zobrazit]:checked").val() == "RESPEKTOVANOST" 
      && $("input:radio[name=Cas]:checked").val() == "DEN" )  
        fillColor = getColor(feature.properties.Resp,'Resp');
    else if ($("input:radio[name=Zobrazit]:checked").val() == "RESPEKTOVANOST" 
      && $("input:radio[name=Cas]:checked").val() == "NOC" )  
        fillColor = getColor(feature.properties.RespN,'Resp');  
    else if ($("input:radio[name=Zobrazit]:checked").val() == "IMPROVE" 
      && $("input:radio[name=Cas]:checked").val() == "DEN" )  
        fillColor = getColor(feature.properties.IMPROVE,'IMPROVE');  
    else if ($("input:radio[name=Zobrazit]:checked").val() == "IMPROVE" 
      && $("input:radio[name=Cas]:checked").val() == "NOC" )  
        fillColor = getColor(feature.properties.IMPROVEN,'IMPROVE');
    else if ($("input:radio[name=Zobrazit]:checked").val() == "PSDIFF" ) 
        fillColor = getColor(feature.properties.PSDIFF,'PSDIFF');      
    else if ($("input:radio[name=Zobrazit]:checked").val() == "POP" ) 
        fillColor = getColor( (feature.properties.CELKEM_PS > 0 ? 
                                  feature.properties.POP/feature.properties.CELKEM_PS : 0 )
                              ,'POP');        
    if (fillColor == null) fillColor = "black";
    var fillOpacity = feature.properties.opacity;
    if (fillOpacity == null) fillOpacity = .2;
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: fillOpacity };
  },
  onEachFeature: function onEachFeature(feature, layer) {

    
    var scode = 'CODE';
    if (feature.properties.hasOwnProperty('CODE')) {
      scode = feature.properties['CODE'];
    } else {
      console.warn('DATAMAP: Property CODE not found.');
    }
    
    var popupContent = '';
    popupContent += scode;
    layer.bindPopup(popupContent, {});
    layer.on({         
         click: passDataToIfno
    });
  },
  pointToLayer: function pointToLayer(feature, latlng) {
    var r = feature.properties.r;
    if (r == 0) r = 10;
    return new L.Circle(latlng, { radius: r });
  }
});
DATAMAP.on('popupopen', function (popup) {
  
});



var ZTPRZ = L.geoJson(null, {
  layerName: 'ZTPRZ',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.ZPS_ID;
    if (density == 0) fillColor = "#ff0000";else fillColor = "#ff0000"; // no data
    return { color: "#000000", weight: 1, fillColor: fillColor, fillOpacity: .9 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("RZ: <strong>" + feature.properties.RZ + "</strong><br/>" + "object: " + feature.properties.LEVEL + "/" + feature.properties.NUMBER + "<br/>" + "object-type: Vyhrazené stání ZTP<br/>" + "zps-id: " + feature.properties.ZPS_ID + "<br/>" + "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" + "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>");
  }
});

var ZAKAZ = L.geoJson(null, {
  layerName: 'ZAKAZ',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.ZPS_ID;
    if (density == 0) fillColor = "#000000";else fillColor = "#000000"; // no data
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: .9 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("<strong>ZÁKAZ</strong><br/>" + "object: " + feature.properties.LEVEL + "/" + feature.properties.NUMBER + "<br/>" + "object-type: Zákaz stání <br/>" + "zps-id: " + feature.properties.ZPS_ID + "<br/>" + "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" + "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>");
  }
});

var SPEC = L.geoJson(null, {
  layerName: 'SPEC',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.ZPS_ID;
    if (density == 0) fillColor = "#00FF00";else fillColor = "#00FF00"; // no data
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: .9 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("<strong>Vyhrazeno</strong><br/>" + "object: " + feature.properties.LEVEL + "/" + feature.properties.NUMBER + "<br/>" + "object-type: Vyhrazené stání <br/>" + "zps-id: " + feature.properties.ZPS_ID + "<br/>" + "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" + "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>");
  }
});

var ZAS = L.geoJson(null, {
  layerName: 'ZAS',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.ZPS_ID;
    if (density == 0) fillColor = "#008800";else fillColor = "#008800"; // no data
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: .9 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("<strong>" + feature.properties.DRUHZAS_T + "</strong><br/>" + "object: " + feature.properties.LEVEL + "/" + feature.properties.NUMBER + "<br/>" + "object-type: Zásobování <br/>" + "zps-id: " + feature.properties.ZPS_ID + "<br/>" + "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" + "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>");
  }
});

var selected;

var EXT = L.geoJson(null, {
  layerName: 'EXT',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.PHASE;
    if (density == 0) fillColor = "#ff9900";else fillColor = "#ff9900"; // no data
    return { color: '#ff0000', weight: 2, fillColor: fillColor, fillOpacity: .2 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("<strong>" + feature.properties.PHASE + "</strong><br/>"
    //        + "object: " + feature.properties.LEVEL + "/"+ feature.properties.NUMBER + "<br/>"
    + "Připravované rozšíření ZPS <br/>"
    //        + "zps-id: " + feature.properties.ZPS_ID + "<br/>" 
    //        + "Platný od: " + feature.properties.PLATNOSTOD.substr(0,10) + "<br/>" 
    //        + "Platný do: " + feature.properties.PLATNOSTDO.substr(0,10) + "<br/>" 
    );
  }
}).on('click', function (feature) {
  // Check for selected
  if (selected) {
    // Reset selected to default style
    feature.target.resetStyle(selected);
  }
  // Assign new selected
  selected = feature.layer;
  // Bring selected to front
  // selected.bringToFront()
  // Style selected
  selected.setStyle({
    'color': '#ff0000',
    'fillColor': '#ff6600'
  });
});


var feature;

function chooseAddr(lat1, lng1, lat2, lng2, osm_type) {
  var loc1 = new L.LatLng(lat1, lng1);
  var loc2 = new L.LatLng(lat2, lng2);
  var bounds = new L.LatLngBounds(loc1, loc2);

  if (feature) {
    map.removeLayer(feature);
  }
  if (osm_type == "node") {
    feature = L.circle(loc1, 25, { color: 'green', fill: false }).addTo(map);
    map.fitBounds(bounds);
    map.setZoom(18);
  } else {
    var loc3 = new L.LatLng(lat1, lng2);
    var loc4 = new L.LatLng(lat2, lng1);

    feature = L.polyline([loc1, loc4, loc2, loc3, loc1], { color: 'red' }).addTo(map);
    map.fitBounds(bounds);
  }
}

function addr_search() {
  var inp = document.getElementById("addr");

  $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=5&viewbox=14.209442,50.179536,14.710007,49.934428&bounded=1&q=' + inp.value, function (data) {
    var items = [];

    $.each(data, function (key, val) {
      bb = val.boundingbox;
      items.push("<li><a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3] + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
    });

    $('#results').empty();
    if (items.length != 0) {
      $('<p>', { html: "Search results:" }).appendTo('#results');
      $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      }).appendTo('#results');
    } else {
      $('<p>', { html: "No results found" }).appendTo('#results');
    }
  });
}
