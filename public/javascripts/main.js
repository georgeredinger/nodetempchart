var socket=io.connect(), d1=[], batt=[], zone_delta=(new Date()).getTimezoneOffset()*60000;	// time diff in ms
var limit=150000;
function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
}

socket.on('newdata', function(v) {
	var ts=v[0]-zone_delta;
	var box = '<td class="legendColorBox"><div style="border:1px solid  white ;padding:1px><div style="width:4px;height:0;border:5px solid  black;overflow:hidden"></div></div></td>'

  var d = new Date();
	d1.push([ts, v[1]]);	
	batt.push([ts, v[2]]);	
	re_flot();	
	var i=1;
	$('#legend').find('tr').each(function() {
		$(this).append('<td class="last_val">'+Math.round(v[i++]*100,3)/100+'</td>');
	});
 d.getHours();
 d.getMinutes();
	$('#legend').find('table').append('<tr>'+box+'<td>Last Sample at:</td> <td>'+d.getHours()+':'+zeroPad(d.getMinutes(),2)+'</td></tr>');
});



socket.on('history', function(a) {
	for(var i=0, l=a.length;i<l;i++) {
		var v=a[i],  ts=v[0]-zone_delta;
		d1.push([ts, v[1]]);	
		batt.push([ts, v[2]]);	
	}
	re_flot();
});

socket.on('init', function(v) {
	limit=v.limit;
});	

socket.on('setint', function(v) {
	if(!isNaN(v)) {
		$('#update_int_lbl').text(v);
		$('#update_int').slider('option', 'value', v);
	}
});	

function re_flot() {
	var d1_len=d1.length;
	if(d1_len<1) { return; }
	// slice arrays if len>limit
	if(d1_len>limit) {
		d1=d1.slice(0-limit);
	}
	d1_len=d1.length;
	var tick_int=Math.round((d1[d1_len-1][0]-d1[0][0])/(600));
	console.log('tick_int:'+tick_int);
	var d=[
		{ data: d1, label:'Temperature (F): '},
		{ data: batt, label:'batt (volts) : ',yaxis:2},
	];
	$.plot(
		$('#testflot'), 
		d,
		{
			//xaxis:{mode:'time', timeFormat:'%h:%M', tickSize:[tick_int, "second"]},
			xaxis:{mode:'time', timeFormat:'%d', tickSize:[1, "day"]},
			// outside yaxis: {min:-12, max: 102,  tickSize: 10}, 
      grid: { hoverable: true, clickable: true },
      tooltip: true,
      tooltipOpts: {
        content: "%s for %x was %y.2",
        dateFormat: "%y-%0m-%0d",
        xDateFormat: "%H:%M:%S",
        },
			yaxis: {min:0, max: 100,  tickSize: 5,hoverable: true, clickable: true}, //inside
			y2axis: {min:3.4, max: 4.2,  tickSize: 0.1}, 
			legend: { container: $('#legend') }
		}
	);
}


