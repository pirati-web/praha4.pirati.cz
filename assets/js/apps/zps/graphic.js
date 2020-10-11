var Obs_colors = ['#ffff00','#ffff93','#ffffd4','#fffff4','#ffc4b0','#ff9b7e','#ff603e','#ff0000'];
var Obs_grades = [30,50,70,80,90,100,130];
var Resp_colors = ['#ff0000','#ff805f','#ffc6b3','#ffff00','#ffff93','#d8ffb3','#80ff00'];
var Resp_grades = [20,40,60,70,80,90];
var IMPROVE_colors = ['#ff0000','#ff805f','#f7ffee','#d8ffb3','#80ff00','#17ae11','#065c03'];
var IMPROVE_grades = [-0.1,-0.01,0.1,0.2,0.4,0.6];
var PSDIFF_colors = ['#ff0000','#ff805f','#ffc6b3','#f7ffee','#d8ffb3','#80ff00'];
var PSDIFF_grades = [-10,-5,-1,5,10];
var POP_colors = ['#065c03','#17ae11','#80ff00','#f7ffee','#ffff93','#ffff00','#ff805f','#ff0000'];
var POP_grades = [0.5,0.8,1,1.2,1.5,2,3];


function getColor (d, ctype) {
	if (ctype == 'Obs') {dcolors = Obs_colors; dgrades = Obs_grades;}
	if (ctype == 'Resp') {dcolors = Resp_colors; dgrades = Resp_grades;}
	if (ctype == 'IMPROVE') {dcolors = IMPROVE_colors; dgrades = IMPROVE_grades;}
	if (ctype == 'PSDIFF') {dcolors = PSDIFF_colors; dgrades = PSDIFF_grades;}
  if (ctype == 'POP') {dcolors = POP_colors; dgrades = POP_grades;}
  	resul_color = dcolors[0];
	for (var i = 0; i < dgrades.length; i++) {
            if (d > dgrades[i])  resul_color = dcolors[i+1] ;
          }
    return resul_color;
    }    


function getLegend(ctype) {
	dcolors = Obs_colors; dgrades = Obs_grades; Title = 'Obsazenost';
	if (ctype == 'OBSAZENOST') {dcolors = Obs_colors; dgrades = Obs_grades; Title = 'Obsazenost Po'; }
  if (ctype == 'OBSAZENOST2') {dcolors = Obs_colors; dgrades = Obs_grades; Title = 'Obsazenost Před'; }
	if (ctype == 'RESPEKTOVANOST') {dcolors = Resp_colors; dgrades = Resp_grades; Title = 'Respektovanost - <BR> podíl oprávněně parkujících aut'; }
	if (ctype == 'IMPROVE') {dcolors = IMPROVE_colors; dgrades = IMPROVE_grades; Title = 'Index změny obsazenosti';}
	if (ctype == 'PSDIFF') {dcolors = PSDIFF_colors; dgrades = PSDIFF_grades; Title = 'Počet legalizovaných <BR> parkovacích míst';}
  if (ctype == 'POP') {dcolors = POP_colors; dgrades = POP_grades; Title = 'Poměr počtu parkovacích oprávnění <BR> na počet parkovacích míst';}
	var LContent = '';
	LContent += '<strong>' + Title + '</strong><br>';
	LContent +=
                  '<span style="background:' + dcolors[0] + '"></span> ';
          for (var i = 0; i < dgrades.length; i++) {
            LContent +=
                    '<span style="background:' + dcolors[i + 1] + '"></span> ';
          }
	LContent += '<br>';
	for (var i = 0; i < dgrades.length; i++) {
            LContent +=
                    '<label>' + dgrades[i] + '</label>';

          }
	return LContent;
    }       

function getInfoContent(props) {
	var popupContent = '';
    popupContent += '<pre>';
    for (var p in props) {
       if (p == 'CATEGORY' ) popupContent += 'Kategorie' + '\t' ;
        if (props[p] == 'RES' ) popupContent += 'Rezidentská (modrá)' + '\n';
        if (props[p] == 'MIX' ) popupContent += 'Smíšená (fialová)' + '\n';
        if (props[p] == 'VIS' ) popupContent += 'Návštěvnická (oranžová)' + '\n';
      if (p == 'CELKEM_PS') popupContent +=  'PS celkem' + '\t' + props[p] + '\n';
      if (p == 'PS_ZPS') popupContent +=  'PS v ZPS' + '\t' + props[p] + '\n';
      if (p == 'POP') popupContent +=  'Parkovacích oprávnění' + '\t' + props[p] + '\n';
      if ($("input:radio[name=Cas]:checked").val() == "DEN"  && $("input:radio[name=Zobrazit]:checked").val() != "OBSAZENOST2" )  {
          if (p == 'Obs' ) popupContent += 'Obsazenost PO' +  '\t' + (props.PS_ZPS > 0 ? 
                                   Math.round(100*props.OBS/props.PS_ZPS) : 0 ) + '% \n';          
        }
      if ($("input:radio[name=Cas]:checked").val() == "DEN"  && $("input:radio[name=Zobrazit]:checked").val() == "OBSAZENOST2" )  {
          if (p == 'Obs' ) popupContent += 'Obsazenost PŘED' +  '\t' + (props.PS_ZPS > 0 ? 
                                   Math.round(100*props.OBS12/props.PS_ZPS) : 0 ) + '% \n';          
        }
      if ($("input:radio[name=Cas]:checked").val() == "NOC"  && $("input:radio[name=Zobrazit]:checked").val() != "OBSAZENOST2" )  {
          if (p == 'Obs' ) popupContent += 'Obsazenost PO' +  '\t' + (props.PS_ZPS > 0 ? 
                                   Math.round(100*props.NOC/props.PS_ZPS) : 0 ) + '% \n';          
        }
      if ($("input:radio[name=Cas]:checked").val() == "NOC"  && $("input:radio[name=Zobrazit]:checked").val() == "OBSAZENOST2" )  {
          if (p == 'Obs' ) popupContent += 'Obsazenost PŘED' +  '\t' + (props.PS_ZPS > 0 ? 
                                   Math.round(100*props.NOC12/props.PS_ZPS) : 0 ) + '% \n';          
        }    
      if ($("input:radio[name=Cas]:checked").val() == "DEN" ) {          
          if (p == 'Resp' ) popupContent += 'Respektovanost' +  '\t' + props[p] + '% \n';
        }
      if ($("input:radio[name=Cas]:checked").val() == "NOC" ) {
          if (p == 'RespN' ) popupContent += 'Respektovanost' +  '\t' + props[p] + '% \n';
        }    
    }
    popupContent += '<div class = "info_title"><b>Rozdělení vozidel dle vzdálenosti' + '\n' + 'adresy majitele od místa parkování </b></div>';
    for (var p in props) {
      if ($("input:radio[name=Cas]:checked").val() == "DEN" ) {      
      if (p == 'GraphData' ) {
        var glegp = p.replace('GraphData', 'GraphLegend');
        var gleg = null;
        if (props.hasOwnProperty(glegp)) {
          gleg = props[glegp];
        }
        popupContent += generateGraph(props[p], p, gleg) + '\n';
         }
       }
      if ($("input:radio[name=Cas]:checked").val() == "NOC" ) {      
      if (p == 'GraphDataN' ) {
        var glegp = p.replace('GraphDataN', 'GraphLegendN');
        var gleg = null;
        if (props.hasOwnProperty(glegp)) {
          gleg = props[glegp];
        }
        popupContent += generateGraph(props[p], p, gleg) + '\n';
         }
       } 
      popupContent += '</pre>';
      }
    return popupContent;
}



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
      if (lval=="R1") {popis = 'do \n 150m';} 
      else if (lval=="R2") {popis = 'do \n 500m';} 
      else if (lval=="R3") {popis = 'do \n 2km';} 
      else if (lval=="R4") {popis = 'nad \n 2km';} 
      else if (lval=="VI") {popis = 'Návště \n vníci';} 
      else if (lval=="NR") {popis = 'Neplatiči';} 
      else if (lval=="FR") {popis = 'Volná';} 
          else {popis='X';} 
      popupGraph += '<div class="bar-legend ">' +  popis + '</div>';
      legendindex++;
    });
    popupGraph += '</div>';
  }

  return popupGraph;
}