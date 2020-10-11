


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


var OtherPS = L.geoJson(null, {
  layerName: 'Ostatní PS',
  style: function style(feature) {
    var fillColor,
        typdat = feature.properties.TYPDAT;
    if (typdat == "RZ") fillColor = "#FFA500";      
      else if (typdat == "SDR") fillColor = "#4F820D"; 
      else if (typdat == "ZAS") fillColor = "#853500"; 
      else if (typdat == "SPEC") fillColor = "#800000";       
      else fillColor = "#000000"; // no data                               ;
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: .6 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    pspopis = "";
    typdat = feature.properties.TYPDAT;
        if (typdat == "RZ") pspopis = "ZTP stání na RZ";      
      else if (typdat == "SDR") pspopis = "ZTP stání veřejné"; 
      else if (typdat == "ZAS") pspopis = "Zásobování"; 
      else if (typdat == "SPEC") pspopis = "Speciální vyhrazené stání";       
      else pspopis = "chyba";
    layer.bindPopup("<strong>" + pspopis + "</strong>" 
      
      );
  }
});

var feature;


