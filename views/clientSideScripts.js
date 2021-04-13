var items=[];
var cartTotal=0;

document.addEventListener("DOMContentLoaded", function(event) { 
  var data = document.getElementById("productList").cloneNode(true);
  console.log(data);
  loadLocal();
});


function allowDrop(ev) {
  ev.preventDefault();
  var targParent = document.getElementById("cartParent");
  targParent.style.backgroundColor='#C3D69B';
}

function dragLeave(ev){
	ev.preventDefault();
	var targParent = document.getElementById("cartParent");
	targParent.style.backgroundColor='#EBF1DE';
}

function drag(ev) {
  ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
	var data = ev.dataTransfer.getData("Text");
	var targ = document.getElementById("cart");
	var targParent = document.getElementById("cartParent");
	targParent.style.backgroundColor='#EBF1DE';
	console.log(targ);
	
	var newElement = document.getElementById(data).cloneNode(true);
	
	var item = extractItem(document.getElementById(data));
	
	var oldStock = item.stock;
	var newStock = oldStock-1;
	
	document.getElementById(data).childNodes[2].innerHTML = newStock>0?newStock:oldStock;
	if(newStock==0){
	  document.getElementById(data).childNodes[0].childNodes[1].childNodes[1].innerHTML = "Out Of Stock";
	  document.getElementById(data).setAttribute('draggable',false);
	  document.getElementById(data).style.backgroundColor='#B7B7B7';
	}
	newElement.setAttribute('draggable',false);
	console.log(newElement.childNodes);
	var s = search(item.name,items);
	if(s>=0){
		items[s].quantity+=1;
		console.log(items[s]);
		document.getElementById(items[s].name+"Quant").innerHTML = "Qty: "+items[s].quantity;
		cartTotal+=items[s].rawPrice;
	}else{
		console.log(item);
		items.push(item);
		cartTotal+=item.rawPrice;
		var itm = buildCartItem(item);
		targ.appendChild(itm);
	}
	//saveLocal();
	document.getElementById("cartTotal").innerHTML = "$"+cartTotal+".00";
	//ev.target.appendChild(newElement);
	ev.preventDefault();
}

function extractItem(element){
	var item={
		name:element.childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerHTML,
		price:element.childNodes[1].innerHTML,
		stock:element.childNodes[2].innerHTML,
		quantity:1,
		rawPrice:parseFloat(element.childNodes[1].innerHTML.substring(1,element.childNodes[1].innerHTML.length)),
		image:element.childNodes[0].childNodes[0].currentSrc
		
	}
	return item;
}

function search(nameKey, cartItems){
	var ind=-1;
    for (var i=0; i < cartItems.length; i++) {
        if (cartItems[i].name === nameKey) {
            ind=i;
        }
    }
	return ind;
}

function buildCartItem(item){
	var d1 = document.createElement("div");
	var d2 = document.createElement("div");
	var im = document.createElement("img");
	var d3 = document.createElement("div");
	var p1 = document.createElement("p");
	var p2 = document.createElement("p");
	var d4 = document.createElement("div");
	var b1 = document.createElement("a");
	var p3 = document.createElement("p");
	
	d1.setAttribute("id",item.name+"Parent");
	d2.setAttribute("id",item.image+"Parent");
	d3.setAttribute("id",item.name+"NameQuantParent");
	d4.setAttribute("id",item.name+"PriceRemove");
	im.setAttribute("id",item.name+item.image);
	p1.setAttribute("id",item.name+"Name");
	p2.setAttribute("id",item.name+"Quant");
	p3.setAttribute("id",item.name+"Price");
	b1.setAttribute("id",item.name+"Remove");
	
	d1.setAttribute("draggable",false);
	d2.setAttribute("draggable",false);
	d3.setAttribute("draggable",false);
	d4.setAttribute("draggable",false);
	im.setAttribute("draggable",false);
	p1.setAttribute("draggable",false);
	p2.setAttribute("draggable",false);
	p3.setAttribute("draggable",false);
	b1.setAttribute("draggable",false);
	b1.setAttribute("onclick","removeItem(event)");
	
	d1.className = "container";
	d2.className = "img";
	b1.className = "btn2";
	p3.className = "rgh";
	
	im.src = item.image;
	
	p1.innerHTML = item.name;
	p2.innerHTML = "Qty: "+item.quantity;
	p3.innerHTML = item.price;
	b1.innerHTML = "Remove";
	
	d1.style.backgroundColor="#D9D9D9";
	d1.style.border = "2px solid black";
	p1.style.fontWeight = "bold";
	
	d4.appendChild(b1);
	d4.appendChild(p3);
	
	d3.appendChild(p1);
	d3.appendChild(p2);
	
	d2.appendChild(im);
	
	d1.appendChild(d2);
	d1.appendChild(d3);
	d1.appendChild(d4);
	
	return d1;
}

function saveLocal(){
	if (typeof(Storage) !== "undefined") {
		localStorage.removeItem("cart");
		localStorage.setItem("cart", JSON.stringify(items));
	}
}
function loadLocal(){
	if (typeof(Storage) !== "undefined") {
		if (localStorage.cart) {
			items=JSON.parse(localStorage.getItem("cart"));
			var parnt = document.getElementById("cart");
			for(var i=0;i<items.length;i++){
				parnt.appendChild(buildCartItem(items[i]));
			}
			calcTotal();
			console.log(items);
		}
	}
}

function removeItem(ev){
	ev.preventDefault();
	var itemName = ev.target.id.substring(0,ev.target.id.length-6);
	var parentId = itemName+"Parent";
	var elem = document.getElementById(parentId);
	console.log(ev.target.id.substring(0,ev.target.id.length-6));
	const myNode = document.getElementById(parentId);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.lastChild);
	}
	elem.parentNode.removeChild(elem);
	for(var i=0;i<items.length;i++){
		if(items[i].name==itemName){
			items.splice(i,1);
			break;
		}
	}
	calcTotal();
	console.log(items);
}

function calcTotal(){
	var total = 0;
	for(var i=0;i<items.length;i++){
		total+=items[i].rawPrice*items[i].quantity;
	}
	cartTotal=total;
	document.getElementById("cartTotal").innerHTML = "$"+cartTotal+".00";
}