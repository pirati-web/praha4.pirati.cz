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
	if (ctype == 'RESPEKTOVANOST') {dcolors = Resp_colors; dgrades = Resp_grades; Title = 'Respektovanost'; }
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

