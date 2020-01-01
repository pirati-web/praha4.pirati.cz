

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function checkFileExistsSync(filepath) {
  var flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

function changeTitle(title) {
  document.title = title;
}
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

/*help popup*/
function fillPopupHelp() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if ($('#popupHelp').hasClass('visibleR') || $('#popupHelp').hasClass('visibleL')) {
    return;
  }
  if (typeof HelpFile !== 'undefined' && HelpFile && HelpFile.includes('.help') && !HelpFile.includes('..')) {
    $.ajax({
      url: HelpFile,
      success: function success(data) {
        $('#popupHelp').html(checkHelpData(data, HelpFile));
        if (callback && typeof callback == "function") {
          callback();
        }
      },
      error: function error(response, status, _error) {
        console.error("fillPopupHelp: return status: " + status + " ERR: " + _error);
        if (callback && typeof callback == "function") {
          callback();
        }
      }
    });
  }
}
function showPopupHelp(e) {
  e.preventDefault();
  if ($('#popupHelp').hasClass('visibleR') || $('#popupHelp').hasClass('visibleL')) {
    $('#popupHelp').removeClass('visibleL');
    $('#popupHelp').removeClass('visibleR');
    return;
  }
  if ($('#popupInfo').hasClass('visibleR') || $('#popupInfo').hasClass('visibleL')) {
    $('#popupInfo').removeClass('visibleL');
    $('#popupInfo').removeClass('visibleR');
  }
  fillPopupHelp(function () {
    var visclass = 'visibleR';
    var helpPos = $('.leaflet-popup-content').offset().left + $('.leaflet-popup-content').width() - 50;
    if ($(window).width() / 2 < helpPos) {
      visclass = 'visibleL';
    }
    $('#popupHelp').addClass(visclass);
    checkHelpScroll($('#popupHelp'));
  });
}
function showLegendHelp(e) {
  e.preventDefault();
  if ($('#legendHelp').hasClass('visibleB')) {
    $('#legendHelp').removeClass('visibleB');
    return;
  }
  fillLegendHelp(function () {
    var visclass = 'visibleB';
    var helpPos = $('.legend').offset().left + $('.legend').width() + 320 + (document.getElementById('navbox') ? 300 : 0);
    $('#legendHelp').addClass(visclass);
    checkHelpScroll($('#legendHelp'));
  });
}

function fillLegendHelp() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if ($('#visibleB').hasClass('visibleB')) {
    return;
  }
  if (typeof HelpLegendFile !== 'undefined' && HelpLegendFile && HelpLegendFile.includes('.help') && !HelpLegendFile.includes('..')) {
    $.ajax({
      url: HelpLegendFile,
      success: function success(data) {
        $('#legendHelp').html(checkHelpData(data, HelpLegendFile));
        if (callback && typeof callback == "function") {
          callback();
        }
      },
      error: function error(response, status, _error2) {
        console.error("fillLegendHelp: return status: " + status + " ERR: " + _error2);
        if (callback && typeof callback == "function") {
          callback();
        }
      }
    });
  }
}
function checkHelpScroll(hel) {
  //setTimeout(() => {
  if (hel[0].lastChild.classList.contains('y_scrollable')) {
    hel[0].lastChild.classList.remove('y_scrollable');
  }
  if (hel[0].lastChild.offsetHeight > 599) {
    hel[0].lastChild.classList.add('y_scrollable');
  }
  //}, 250);
}
function checkHelpData(data, helppath) {
  var helpfilename = helppath.split('\\').pop().split('/').pop();
  var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
  return '<div id="popupHelpContent">' + ((isHTML(data) ? data : '<nadpis>Nápověda</nadpis><br>' + data.replace(/(?:\r\n|\r|\n)/g, '<br>')) + '<podpis>' + helpfilename + '</podpis>') + '</div>';
}

function showPopupInfo(e, scode) {
  e.preventDefault();
  if ($('#popupInfo').hasClass('visibleR') || $('#popupInfo').hasClass('visibleL')) {
    $('#popupInfo').removeClass('visibleL');
    $('#popupInfo').removeClass('visibleR');
    return;
  }
  if ($('#popupHelp').hasClass('visibleR') || $('#popupHelp').hasClass('visibleL')) {
    $('#popupHelp').removeClass('visibleL');
    $('#popupHelp').removeClass('visibleR');
  }

  fillPopupInfo(scode, function () {
    var visclass = 'visibleR';
    //let helpPos = $('.leaflet-popup-content').offset().left + $('.leaflet-popup-content').width() + 320 + (document.getElementById('navbox') ? 300 : 0);
    var helpPos = $('.leaflet-popup-content').offset().left + $('.leaflet-popup-content').width() - 50;
    if ($(window).width() / 2 < helpPos) {
      visclass = 'visibleL';
    }
    $('#popupInfo').addClass(visclass);
    //checkHelpScroll($('#popupInfo'));
  });
}
function checkInfoData(data, code, helppath) {
  var helpfilename = helppath.split('\\').pop().split('/').pop();
  var nadpis = code;
  var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
  var html = (isHTML(data) ? '<nadpis>' + nadpis + '</nadpis><br>' + data : '<nadpis>' + nadpis + '</nadpis><br>' + data.replace(/(?:\r\n|\r|\n)/g, '<br>')) + '<br><podpis>' + helpfilename + '</podpis>';
  return html;
}
function getInfoFile() {
  var infowinfile = 'notfound.tsv';
  if (typeof GeoDataFile !== 'undefined' && GeoDataFile && GeoDataFile !== '') {
    var GeoDataPath = GeoDataFile.substr(0, GeoDataFile.lastIndexOf("/") + 1);
    //let GeoDataPath = '/puzzle/genmaps/P04/';
    infowinfile = GeoDataFile.substr(GeoDataFile.lastIndexOf("/") + 1, GeoDataFile.length);

    var sname = infowinfile.split("_");
    infowinfile = 'TW_' + sname[1].substring(0, 6) + 'X_7A.tsv';
    infowinfile = GeoDataPath + infowinfile;
  }

  if (infowinfile.includes('..')) {
    return '';
  }
  if (!infowinfile.includes('.tsv')) {
    infowinfile = infowinfile + '.tsv';
  }
  return infowinfile;
}
function urlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status != 404;
}
function fillPopupInfo(scode) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  //let infowinfile = 'notfound.tsv';
  if ($('#popupInfo').hasClass('visibleR') || $('#popupInfo').hasClass('visibleL')) {
    return;
  }
  /*if (GeoDataFile !== undefined && GeoDataFile !== ''){
  let GeoDataPath = GeoDataFile.substr(0, GeoDataFile.lastIndexOf("/") + 1);
  //let GeoDataPath = '/puzzle/genmaps/P04/';
  infowinfile = GeoDataFile.substr(GeoDataFile.lastIndexOf("/") + 1, GeoDataFile.length);
  
  let sname = infowinfile.split("_");
  infowinfile = 'TW_'+sname[1].substring(0, 6)+'X_7A.tsv';
  infowinfile = GeoDataPath+infowinfile;
  }
  
  if (infowinfile.includes('..')) {
      return;
  }
  if (!infowinfile.includes('.tsv')) {
      infowinfile = infowinfile + '.tsv';
  }*/
  var infowinfile = getInfoFile();
  if (infowinfile == '') {
    return;
  }
  var tabledata = '';
  $.ajax({
    type: 'get',
    url: '/cgi-bin/gentranstable.pl?' + infowinfile + '&' + scode,
    success: function success(data) {
      tabledata = tablecode;
      scode = seccode;
      $('#popupInfo').html(checkInfoData(tabledata, scode, infowinfile));
      if (callback && typeof callback == "function") {
        callback();
      }
    },
    error: function error(response, status, _error3) {
      console.error("generateInfoTable: return status: " + status + " ERR: " + _error3);
    }
  });
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

var KNpodklad = L.tileLayer.wms('https://services.cuzk.cz/wms/wms.asp', {
  maxZoom: 24,
  minZoom: 19,
  layers: 'KN',
  crs: L.CRS.EPSG900913,
  format: 'image/png',
  transparent: true,
  uppercase: true
});

// tile layer
var CARSpodklad = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  zoomControl: false,
  Opacity: .8
});

// GeoJson layer
var Useky = L.geoJson(null, {
  layerName: 'Useky',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.TYPZONY;
    if (density == 1) fillColor = "#77aaff";else if (density == 2) fillColor = "#f477ff";else if (density == 3) fillColor = "#ffbe11";else if (density == 4) fillColor = "#c2e699";else fillColor = "#f7f7f7"; // no data                               ;
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: .6 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("Tarif: <strong>" + feature.properties.TARIFTAB + "</strong><br/>" + "object: " + feature.properties.LEVEL + "/" + feature.properties.NUMBER + "<br/>" + "object-type: Technický úsek<br/>" + "zps-id: " + feature.properties.ZPS_ID + "<br/>" + "Kapacita: " + feature.properties.CELKEM_PS + " ZPS: " + feature.properties.PS_ZPS + "<br/>" + "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" + "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>" + "<a href=\"https://ke-utc.appspot.com/static/onstreet.html?shortname=" + feature.properties.TARIFTAB + "\" target=\"_blank\">VPH</a>" + "<br/>");
  }
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

var DATAMAP = L.geoJson(null, {
  layerName: 'DATAMAP',
  style: function style(feature) {
    var fillColor = feature.properties.fill;
    if (fillColor == null) fillColor = "#ff0000";
    var fillOpacity = feature.properties.opacity;
    if (fillOpacity == null) fillOpacity = .2;
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: fillOpacity };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    //        layer.bindPopup(
    //				'<pre>'+JSON.stringify(feature.properties,null,' ').replace(/[\{\}"]/g,'')+'</pre>');
    //        var popupContent = '<table>';
    //        for (var p in feature.properties) {
    //        if (p!="fill"&&p!="opacity") popupContent += '<tr><td>' + p + '</td><td>'+ feature.properties[p] + '</td></tr>';
    //      }
    var popupHelpButton = '<div class="popup-help-button" onclick="javascript:showPopupHelp(event);" style="outline: none;">?</div>';
    var scode = 'CODE';
    if (feature.properties.hasOwnProperty('CODE')) {
      scode = feature.properties['CODE'];
    } else {
      console.warn('DATAMAP: Property CODE not found.');
    }
    var popupInfoButton = '<div class="popup-info-button ' + (scode == 'CODE' ? 'hidden' : '') + '" onclick="javascript:showPopupInfo(event,\'' + scode + '\');" style="outline: none;">i</div>';
    var popupContent = popupInfoButton + popupHelpButton;
    popupContent += '<pre>';
    for (var p in feature.properties) {
      if (p != "fill" && p != "opacity" && p != "r" && !p.includes('GraphData') && !p.includes('stroke') && !p.includes('GraphLegend')) popupContent += p + '\t' + feature.properties[p] + '\n';
      if (p.includes('GraphData')) {
        var glegp = p.replace('GraphData', 'GraphLegend');
        var gleg = null;
        if (feature.properties.hasOwnProperty(glegp)) {
          gleg = feature.properties[glegp];
        }
        popupContent += generateGraph(feature.properties[p], p, gleg) + '\n';
      }
    }
    popupContent += '</pre>';
    var popupHelp = '<div id="popupHelp"><h3>Nápověda bohužel není k dispozici.</h3></div>';
    var popupInfo = '<div id="popupInfo"><h3>Žádné podrobnosti nejsou v tuto chvíli k dispozici..</h3></div>';
    popupContent += popupHelp + popupInfo;
    layer.bindPopup(popupContent, { minWidth: max_popup_width });
  },
  pointToLayer: function pointToLayer(feature, latlng) {
    var r = feature.properties.r;
    if (r == 0) r = 10;
    return new L.Circle(latlng, { radius: r });
  }
});
DATAMAP.on('popupopen', function (popup) {
  inffile = getInfoFile();
  if (inffile == '') {
    $('.popup-info-button').addClass('hidden');
  }
  if (!urlExists(inffile)) {
    $('.popup-info-button').addClass('hidden');
  }
});
var ZTPPUB = L.geoJson(null, {
  layerName: 'ZTPPUB',
  style: function style(feature) {
    var fillColor,
        density = feature.properties.ZPS_ID;
    if (density == 0) fillColor = "#ffff00";else fillColor = "#ffff00"; // no data
    return { color: fillColor, weight: 1, fillColor: fillColor, fillOpacity: .9 };
  },
  onEachFeature: function onEachFeature(feature, layer) {
    layer.bindPopup("<strong>ZTP-SDR (" + feature.properties.POCINVST + "x)</strong><br/>" + "object: " + feature.properties.LEVEL + "/" + feature.properties.NUMBER + "<br/>" + "object-type: Veřejné stání ZPS<br/>" + "zps-id: " + feature.properties.ZPS_ID + "<br/>" + "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" + "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>");
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
    //				+ "object: " + feature.properties.LEVEL + "/"+ feature.properties.NUMBER + "<br/>"
    + "Připravované rozšíření ZPS <br/>"
    //				+ "zps-id: " + feature.properties.ZPS_ID + "<br/>" 
    //				+ "Platný od: " + feature.properties.PLATNOSTOD.substr(0,10) + "<br/>" 
    //				+ "Platný do: " + feature.properties.PLATNOSTDO.substr(0,10) + "<br/>" 
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

//  GeoJson layer
var PAIcon = L.icon({
  iconUrl: '/PA.png',
  iconSize: [20, 20]
});
var PAPIcon = L.icon({
  iconUrl: '/PAP.gif',
  iconSize: [20, 20]
});
var PATIcon = L.icon({
  iconUrl: '/PAT.gif',
  iconSize: [20, 20]
});
var PAXIcon = L.icon({
  iconUrl: '/PAX.gif',
  iconSize: [20, 20]
});

var DataPA = L.geoJson(null, {
  pointToLayer: function pointToLayer(feature, latlng) {
    var PXIcon,
        PAstatus = feature.properties.STAVPA;
    if (PAstatus == 1) PXIcon = PAIcon;else if (PAstatus == 2) PXIcon = PATIcon;else if (PAstatus == 3) PXIcon = PAXIcon;else if (PAstatus == 4) PXIcon = PAPIcon;else PXIcon = PAXIcon;

    var PXStav,
        PAstatus = feature.properties.STAVPA;
    if (PAstatus == 1) PXStav = "V Provozu";else if (PAstatus == 2) PXStav = "Mimo provoz";else if (PAstatus == 3) PXStav = "Zrušen";else if (PAstatus == 4) PXStav = "Připravován";else PXStav = "COSI JE BLBĚ !!!";

    var marker = L.marker(latlng, { icon: PXIcon });
    marker.bindPopup("<strong>PA " + feature.properties.PA + "</strong><br/>" + "Stav: " + PXStav + "<br/>" + "Místo: " + feature.properties.STREET + "<br/>" + "Platný od: " + feature.properties.PLATNOSTOD.substr(0, 10) + "<br/>" + "Platný do: " + feature.properties.PLATNOSTDO.substr(0, 10) + "<br/>");
    return marker;
  }
});

// GeoJson layer
var CARIcon = L.icon({
  iconUrl: '/NarrowR.png',
  iconSize: [20, 20]
});

var TRACIcon = L.icon({
  iconUrl: '/NarrowR.png',
  iconSize: [25, 25]
});
// ?image.rotate(angle)

var DataCAR1 = L.geoJson(null, {
  pointToLayer: function pointToLayer(feature, latlng) {
    var marker = L.marker(latlng, { icon: CARIcon, rotationAngle: feature.properties.rawcourse });
    marker.bindPopup("<a href=\"V:\\CARS\\" + feature.properties.photopath + "\">foto</a><br/>V:\\CARS\\" + feature.properties.photopath);
    return marker;
  }
});

var DataCAR2 = L.geoJson(null, {
  pointToLayer: function pointToLayer(feature, latlng) {
    var marker = L.marker(latlng, { icon: CARIcon, rotationAngle: feature.properties.rawcourse });
    marker.bindPopup("V:\\CARS\\" + feature.properties.photopath + "<br/>");
    return marker;
  }
});

var DataTRACE1 = L.geoJson(null, {
  pointToLayer: function pointToLayer(feature, latlng) {
    var marker = L.marker(latlng, { icon: TRACIcon, rotationAngle: feature.properties.Smer });
    marker.bindPopup("Jednosměrka");
    return marker;
  }
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