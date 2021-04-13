const http = require('http');
const express = require('express');
const xml2js = require('xml2js');
const url = require('url');
const fs = require('fs');
const app = express();
const port = 3000;


var xml=[];
var data;

var server = app.listen(port, listening);
function listening(){
	console.log("listening...");
}
app.use(express.static('views'));

app.set('view engine', 'pug');
app.get('/', index);


function index(request, response){
	http.get(url.parse('http://www.partechgss.com/inventory'), function(res) {
		var data = [];
		var next='';
		res.on('data', function(chunk) {
			next += chunk.toString();
		}).on('end', function() {
			xml2js.parseString(next,function(err,result){
			xml=result;
			xml.inventory.product.forEach(myFunction);
			//console.log(xml);
			response.render('index', {dt:xml.inventory.product});
			});
		});
	});
	
	
}
function myFunction(item, index){
	let img = String(item.product_img);
	item.product_img = img;
	console.log(item.product_name);
	console.log(item.unit_price);
	console.log(item.quantity_in_stock);
	console.log(img.trim());
	console.log('');
}
