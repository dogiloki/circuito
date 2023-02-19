class Scenery{

	static tools={
		connect:'Conectar',
		btn:'Modo boton',
		move:'Modo mover'
	};

	constructor(canvas){
		this.canvas=canvas;
		this.ctx=canvas.getContext("2d");
		this.nodes=[];
		this.nodes_btn=[];
		this.connections=[];
		this.pressing=false;
		this.pressing_key=false;
		this.selection={
			x:0,
			y:0,
			node:null,
			tool:null
		};
		this.canvas.addEventListener('mousedown',(event)=>{
			this.selection.x=event.clientX-this.canvas.offsetLeft;
			this.selection.y=event.clientY-this.canvas.offsetTop;
			this.pressing=true;
			// Buscar selección de alguno objeto
			try{
				this.nodes.forEach((node)=>{
					if(this.selection.x>=node.x && this.selection.x<=(node.x+node.width) && this.selection.y>=node.y && this.selection.y<=(node.y+node.height)){
						throw node;
					}
				});
				this.selection.node=null;
			}catch(node){
				if(this.selection.node!=null){
					switch(this.selection.tool){
						case Scenery.tools.connect: this.addConnect(node,this.selection.node); return;
					}
				}
				if(!this.pressing_key && this.selection.tool!=Scenery.tools.connect && this.selection.tool!=Scenery.tools.move){
					this.selection.tool=node.isBtn()?Scenery.tools.btn:Scenery.tools.move;
				}
				switch(this.selection.tool){
					case Scenery.tools.btn:
						if(node.isBtn()){
							node.changeStatus();
							node.getOutput().logic();
							this.render(true);
						}
						break;
				}
				this.selection.node=node;
			}
		});
		this.canvas.addEventListener('mouseup',()=>{
			this.pressing=false;
			this.render();
		});
		this.canvas.addEventListener('mousemove',(event)=>{
			if((!this.pressing && !this.pressing_key && this.selection.tool!=Scenery.tools.connect) || this.selection.node==null){
				return;
			}
			let node=this.selection.node;
			let x=(event.clientX-this.canvas.offsetLeft);
			let y=(event.clientY-this.canvas.offsetTop);
			switch(this.selection.tool){
				case Scenery.tools.move:
					node.x=x;
					node.y=y;
					this.render();
					break;
				case Scenery.tools.connect:
					this.renderLine(node.x+node.width/2,node.y+node.height/2,x,y);
					break;
				default: break;
			}

		});
		document.addEventListener('keydown',(event)=>{
			if(this.pressing_key){
				return;
			}
			this.pressing_key=true;
			switch(event.key){
				case 'Shift': this.changeTool(Scenery.tools.connect); break;
				case 'Control': this.changeTool(Scenery.tools.move); break;
			}
		});
		document.addEventListener('keyup',(event)=>{
			this.pressing_key=false;
			switch(event.key){
				case 'Delete': this.deleteNode(this.selection.node); break;
				case 'Shift': this.changeTool(Scenery.tools.btn); break;
				case 'Control': this.changeTool(Scenery.tools.btn); break;
			}
		});
	}

	changeTool(tool){
		this.selection.tool=tool;
		this.selection.node=null;
	}

	addNode(node){
		this.nodes.push(node);
		if(node.isBtn()){
			this.nodes_btn.push(node);
		}
		this.render();
	}

	deleteNode(node_delete){
		if(node_delete==null){
			return;
		}
		this.nodes=this.nodes.filter((node)=>{
			node.inputs=node.inputs.filter((node_input)=>{
				return node_delete.id!=node_input.id;
			});
			node.outputs=node.outputs.filter((node_output)=>{
				return node_delete.id!=node_output.id;
			});
			node.logic();
			return node_delete.id!=node.id;
		});
		this.nodes_btn=this.nodes_btn.filter((node)=>{
			return node_delete.id!=node.id;
		});
		this.selection.node=null;
		this.render(true);
	}

	addConnect(node1,node2){
		if(node1.id==node2.id){
			return;
		}
		// let connection=new Connection();
		// connection.node1=node1;
		// connection.node2=node2;
		// this.connections.push(connection);
		node1.addInput(node2);
		node2.addOutput(node1);
		this.selection.node=null;
		this.render(true);
	}

	render(change_img=false){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.nodes.forEach((node)=>{
			if(this.selection.node!=null && this.selection.node.id==node.id && !node.isBtn()){
				this.ctx.fillStyle='blue';
				this.ctx.fillRect(node.x-3,node.y-3,node.width+6,node.height+6);
			}
			if(node.icon==null || node.logic_gate==Node.logic_gate.led){
				this.ctx.fillStyle=node.status?'green':'red';
				this.ctx.fillRect(node.x,node.y,node.width,node.height);
			}else{
				if((node.img??null)==null || change_img){
					let img=document.createElement('img');
					img.width=node.width;
					img.height=node.height;
					img.src=node.icon;
					img.onload=()=>{
						node.img=img;
						this.ctx.drawImage(node.img,node.x,node.y,node.width,node.height);
					};
				}else{
					this.ctx.drawImage(node.img,node.x,node.y,node.width,node.height);
				}
				if(node.isBtn()){
					let x=node.x-5;
					let y=node.y+10;
					this.ctx.font="20px Courier New";
					this.ctx.fillStyle="black";
					this.ctx.fillText(node.value,x,y);
				}
			}
			node.inputs.forEach((node_line)=>{
				this.ctx.lineWidth=2;
				this.ctx.strokeStyle='black';
				this.ctx.beginPath();
				this.ctx.moveTo(node.x-7,node.y+node.height/2);
				this.ctx.lineTo(node_line.x+node_line.width/2,node_line.y+node_line.height/2);
				this.ctx.stroke();
				this.ctx.closePath();
			});
		});
	}

	renderLine(x1,y1,x2,y2){
		this.render();
		this.ctx.lineWidth=2;
		this.ctx.strokeStyle='black';
		this.ctx.beginPath();
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		this.ctx.stroke();
		this.ctx.closePath();
	}

}