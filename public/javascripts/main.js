var socket=io.connect(), d1=[],  zone_delta=(new Date()).getTimezoneOffset()*60000;	// time diff in ms
var limit=86400; 
socket.on('newdata', function(v) {
	var ts=v[0]-zone_delta;
	d1.push([ts, v[1]]);	
	re_flot();	
	var i=1;
	$('#legend').find('tr').each(function() {
		$(this).append('<td class="last_val">'+v[i++]+'</td>');
	});
});
socket.on('history', function(a) {
	for(var i=0, l=a.length;i<l;i++) {
		var v=a[i],  ts=v[0]-zone_delta;
		d1.push([ts, v[1]]);	
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
	var tick_int=Math.round((d1[d1_len-1][0]-d1[0][0])/6000);
	var d=[
		{ data: d1, label:'last temperature: '},
	];
	$.plot(
		$('#testflot'), 
		d,
		{
			xaxis:{mode:'time', timeFormat:'%d %h:%M', tickSize:[tick_int, "second"]},
			legend: { container: $('#legend') }
		}
	);
}


