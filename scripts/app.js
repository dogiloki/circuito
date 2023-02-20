var btn_add_btn=document.getElementById('btn-add-btn');
var btn_add_logic_gate=document.getElementById('btn-add-logic-gate');
var box_logic_gate=document.getElementById('box-logic-gate');
var content_tools=document.getElementById('content-tools');
var content_table=document.getElementById('content-table');
var btn_table=document.getElementById('btn-table');
var scenery=new Scenery(document.getElementById('canvas'));
var table;
var pressing=false;

document.addEventListener('DOMContentLoaded',()=>{
	Object.keys(Node.logic_gate).forEach((key)=>{
		let option=document.createElement('option');
		option.innerHTML=Node.logic_gate[key];
		option.value=key;
		box_logic_gate.appendChild(option);
	});
	Object.keys(Scenery.tools).forEach((key)=>{
		let btn=document.createElement('button');
		btn.innerHTML=Scenery.tools[key];
		btn.value=key;
		btn.addEventListener('click',()=>{
			this.scenery.changeTool(Scenery.tools[btn.value]);
		});
		content_tools.appendChild(btn);
	});
	this.loadScenary();
});

btn_add_btn.addEventListener('click',()=>{
	let node=new Node(String.fromCodePoint(65+this.scenery.nodes_btn.length));
	node.x=5;
	//node.y=(this.scenery.nodes.length*node.height)+((this.scenery.nodes.length+1)*5);
	node.y=5;
	this.scenery.addNode(node);
});

btn_add_logic_gate.addEventListener('click',()=>{
	let node=new Node(this.btn_add_logic_gate.value);
	node.x=10+node.width;
	//node.y=(this.scenery.nodes.length*node.height)+((this.scenery.nodes.length+1)*5);
	node.y=5;
	node.setLogicGate(Node.logic_gate[this.box_logic_gate.value]);
	this.scenery.addNode(node);
});

btn_table.addEventListener('click',()=>{
	this.generateTable();
});

content_table.addEventListener('mousedown',()=>{
	this.pressing=true;
});

content_table.addEventListener('mouseup',()=>{
	this.pressing=false;
});

content_table.addEventListener('mousemove',(event)=>{
	if(!this.pressing){
		return;
	}
	//content_table.style.left=(event.clientX-10)+"px";
	//content_table.style.top=(event.clientY-10)+"px";
});

function loadScenary(){
	let scenery_file=File.get();
	if(scenery_file==null){
		return;
	}
	scenery=new Scenery(document.getElementById('canvas'));
	let nodes=[];
	// scenery_file.connections.forEach((connection)=>{
	// 	let node1=new Node(connection.node1.value);
	// 	node1.x=connection.node1.x;
	// 	node1.y=connection.node1.y;
	// 	node1.setLogicGate(connection.node1.logic_gate);
	// 	let node2=new Node(connection.node2.value);
	// 	node2.x=connection.node2.x;
	// 	node2.y=connection.node2.y;
	// 	node2.setLogicGate(connection.node2.logic_gate);
	// 	nodes.push(node1);
	// 	scenery.addNode(node1);
	// 	scenery.addNode(node2);
	// 	scenery.addConnect(node1,node2);
	// });
	scenery_file.nodes.forEach((node)=>{
		let node_new=new Node(node.value);
		node_new.x=node.x;
		node_new.y=node.y;
		node_new.setLogicGate(node.logic_gate);
		scenery.addNode(node_new);
	});
	scenery_file.connections.forEach((connection)=>{
		scenery.selection.x=connection.node1.x;
		scenery.selection.y=connection.node1.y;
		scenery.getSelection();
		let node1=scenery.selection.node;
		scenery.selection.x=connection.node2.x;
		scenery.selection.y=connection.node2.y;
		scenery.getSelection();
		let node2=scenery.selection.node;
		scenery.addConnect(node1,node2);
	});
	scenery.render();
	this.scenery=scenery;
}

function saveScenary(){
	this.scenery.nodes.forEach((node)=>{
		node.inputs=[];
		node.outputs=[];
	});
	File.set(this.scenery);
	this.loadScenary();
}

function generateTable(table){
	this.table=new Table(this.scenery.nodes_btn,this.scenery.selection.node);
	this.table.generateTable();
	document.getElementById('table').innerHTML="";
	for(let a=-1; a<this.table.values.length; a++){
		let tr=document.createElement('tr');
		for(let b=0; b<this.table.bits.length; b++){
			let td=document.createElement('td');
			td.textContent=a==-1?this.table.letters[b]:this.table.values[a][b];
			tr.appendChild(td);
		}
		let td=document.createElement('td');
		td.textContent=a==-1?"Salida":this.table.outputs[a];
		tr.appendChild(td);
		document.getElementById('table').appendChild(tr);
	}
}