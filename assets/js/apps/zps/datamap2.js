

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
        fillColor = getColor((feature.properties.PS_ZPS > 0 ? 
                                  100*feature.properties.OBS/feature.properties.PS_ZPS : 0 )
                              ,'Obs');
    else if ($("input:radio[name=Zobrazit]:checked").val() == "OBSAZENOST" 
      && $("input:radio[name=Cas]:checked").val() == "NOC" ) 
        fillColor = getColor((feature.properties.PS_ZPS > 0 ? 
                                  100*feature.properties.NOC/feature.properties.PS_ZPS : 0 )
          ,'Obs');  
    else if ($("input:radio[name=Zobrazit]:checked").val() == "OBSAZENOST2" 
      && $("input:radio[name=Cas]:checked").val() == "DEN" ) 
        fillColor = getColor((feature.properties.PS_ZPS > 0 ? 
                                  100*feature.properties.OBS12/feature.properties.PS_ZPS : 0 )
          ,'Obs');
    else if ($("input:radio[name=Zobrazit]:checked").val() == "OBSAZENOST2" 
      && $("input:radio[name=Cas]:checked").val() == "NOC" ) 
        fillColor = getColor((feature.properties.PS_ZPS > 0 ? 
                                  100*feature.properties.NOC12/feature.properties.PS_ZPS : 0 )
            ,'Obs');    
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
        fillColor = getColor( (feature.properties.PS_ZPS > 0 ? 
                                  feature.properties.POP/feature.properties.PS_ZPS : 0 )
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



var feature;


