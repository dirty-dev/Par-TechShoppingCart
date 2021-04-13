const http = require('http');
const express = require('express');
const xml2js = require('xml2js');
const url = require('url');
const fs = require('fs');
const app = express();
const port = 3000;
var xml=[];
var data;
var cartTotal=0;
/*
MAYBE SWITCH FROM PUG TO ANGULAR

NO IDEA HOW TO DO DRAG AND DROP WITH PUG





*/
class product{
	constructor(){
		this.id='';
		this.name='';
		this.price='';
		this.stock='';
		this.img='';
	}
	addId(id){
		this.id=id;
	}
	addName(name){
		this.name=name;
	}
	addPrice(price){
		this.price=price;
	}
	addStock(stock){
		this.stock=stock;
	}
	addImg(img){
		this.img='http://www.partechgss.com/'+img;
	}
}


var server = app.listen(port, listening);
function listening(){
	console.log("listening...");
}
app.use(express.static('views'));

app.set('view engine', 'pug');
app.get('/', index);


function index(request, response){
	/*
	fs.readFile(__dirname + '/inventory.xml' ,function(err,dat){
		if(err){
			throw err;
		}
		dat = dat.toString().trim();
		data = dat.split('<');
		console.log(data);
		
		//xml2js.parseString(dat,function(err,result){
			//data = result;
			//console.log(data.product);
			
		//});
	});
	*/
	/*
	http.get('http://www.partechgss.com/inventory', (resp) => {
		data = [];

		// A chunk of data has been received.
		resp.on('data', (chunk) => {
			data.push(chunk);
			console.log(chunk);
		});

		// The whole response has been received. Print out the result.
		resp.on('end', () => {
			xml2js.parseString(data,function(err,result){
			console.log(result);
		});

		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	});*/
	http.get(url.parse('http://www.partechgss.com/inventory'), function(res) {
		var data = [];
		var next='';
		res.on('data', function(chunk) {
			next += chunk.toString();
			//console.log(next);
		}).on('end', function() {
			xml2js.parseString(next,function(err,result){
			xml=result;
			//console.log(result);
			xml.inventory.product.forEach(myFunction);
			//console.log(xml);
			response.render('index', {dt:xml.inventory.product});
			});
			//console.log(next.trim());
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

/*			
			table
				each val in dt
					tr
						td= val.product_id
						td= val.product_name
						td= '$'+val.unit_price
						td= val.quantity_in_stock
						td
							img(src='http://www.partechgss.com/'+val.product_img)
					*/

