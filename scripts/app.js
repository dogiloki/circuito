var btn_add_btn=document.getElementById('btn-add-btn');
var btn_add_logic_gate=document.getElementById('btn-add-logic-gate');
var box_btn=document.getElementById('box-btn');
var box_logic_gate=document.getElementById('box-logic-gate');
var content_tools=document.getElementById('content-tools');
var content_table=document.getElementById('content-table');
var btn_table=document.getElementById('btn-table');
var scenery=new Scenery(document.getElementById('canvas'));
var table;

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

function loadScenary(){
	let scenery_file=File.get();
	if(scenery_file==null){
		return;
	}
	scenery=new Scenery(document.getElementById('canvas'));
	scenery_file.nodes.forEach((node_file)=>{
		let node=new Node(node_file.value);
		node.x=node_file.x;
		node.y=node_file.y;
		node.setLogicGate(node_file.logic_gate);
		node.inputs=node_file.inputs;
		node.outputs=node_file.outputs;
		scenery.addNode(node);
	});
	scenery.render();
	this.scenery=scenery;
}

function generateTable(table){
	this.table=new Table(this.scenery.nodes_btn,this.scenery.selection.node);
	this.table.generateTable();
	this.content_table.innerHTML="";
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
		this.content_table.appendChild(tr);
	}
}