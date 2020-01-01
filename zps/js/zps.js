var Obs_colors = ['#ffff00','#ffff93','#ffffd4','#fffff4','#ffc4b0','#ff9b7e','#ff603e','#ff0000'];
var Obs_grades = [30,50,70,80,90,100,130];
var Resp_colors = ['#ff0000','#ff805f','#ffc6b3','#f7ffee','#d8ffb3','#80ff00'];
var Resp_grades = [20,40,60,80,90];
var IMPROVE_colors = ['#ff0000','#ff805f','#ffc6b3','#f7ffee','#d8ffb3','#80ff00'];
var IMPROVE_grades = [-0.2,-0.1,-0.05,0,0.05];
var PSDIFF_colors = ['#ff0000','#ff805f','#ffc6b3','#f7ffee','#d8ffb3','#80ff00'];
var PSDIFF_grades = [-20,-5,5,10,20];


function getColor(d, ctype) {
	if (ctype == 'Obs') {dcolors = Obs_colors; dgrades = Obs_grades;}
	if (ctype == 'Resp') {dcolors = Resp_colors; dgrades = Resp_grades;}
	if (ctype == 'IMPROVE') {dcolors = IMPROVE_colors; dgrades = IMPROVE_grades;}
	if (ctype == 'PSDIFF') {dcolors = PSDIFF_colors; dgrades = PSDIFF_grades;}
  	resul_color = dcolors[1];
	for (var i = 0; i < dgrades.length; i++) {
            if (d > dgrades[i])  resul_color = dcolors[i+1] ;
          }
    return resul_color;
    }    


function getLegend(ctype) {
	dcolors = Obs_colors; dgrades = Obs_grades; Title = 'Obsazenost';
	if (ctype == 'OBSAZENOST') {dcolors = Obs_colors; dgrades = Obs_grades; Title = 'Obsazenost'; }
	if (ctype == 'RESPEKTOVANOST') {dcolors = Resp_colors; dgrades = Resp_grades; Title = 'Respektovanost'; }
	if (ctype == 'IMPROVE') {dcolors = IMPROVE_colors; dgrades = IMPROVE_grades; Title = 'Relativní změna obsazenosti';}
	if (ctype == 'PSDIFF') {dcolors = PSDIFF_colors; dgrades = PSDIFF_grades; Title = 'Počet legalizovaných parkovacích míst';}
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
      if (p != "CODE" && p != "fill" && p != "opacity" && p != "r" && !p.includes('GraphData') && !p.includes('stroke') && !p.includes('GraphLegend')) popupContent += p + '\t' + props[p] + '\n';
      if (p.includes('GraphData')) {
        var glegp = p.replace('GraphData', 'GraphLegend');
        var gleg = null;
        if (props.hasOwnProperty(glegp)) {
          gleg = props[glegp];
        }
        popupContent += generateGraph(props[p], p, gleg) + '\n';
      }
    }
    popupContent += '</pre>';
    return popupContent;
}

