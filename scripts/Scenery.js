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
				if(!this.pressing_key && this.selection.tool!=Scenery.tools.connect){
					this.selection.tool=node.isBtn()?Scenery.tools.btn:Scenery.tools.move;
				}
				switch(this.selection.tool){
					case Scenery.tools.btn:
						if(node.isBtn()){
							node.changeStatus();
							node.getOutput().logic();
						}
						break;
				}
				this.selection.node=node;
			}
			this.render();
		});
		this.canvas.addEventListener('mouseup',()=>{
			this.pressing=false;
		});
		this.canvas.addEventListener('mousemove',(event)=>{
			if(!this.pressing || this.selection.node==null || this.selection.tool!=Scenery.tools.move){
				return;
			}
			let node=this.selection.node;
			node.x=(event.clientX-this.canvas.offsetLeft);
			node.y=(event.clientY-this.canvas.offsetTop);
			this.render();
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
		this.changeTool(Scenery.tools.move);
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
			return node_delete!=node;
		});
		this.nodes_btn=this.nodes_btn.filter((node)=>{
			return node_delete!=node;
		});
		this.selection.node=null;
		this.render();
	}

	addConnect(node1,node2){
		if(node1==node2){
			return;
		}
		node1.addInput(node2);
		node2.addOutput(node1);
		this.selection.node=null;
		this.render();
	}

	render(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.nodes.forEach((node)=>{
			this.ctx.fillStyle=node.status?'green':'red';
			if(node.icon==null || node.logic_gate==Node.logic_gate.led){
				this.ctx.fillRect(node.x,node.y,node.width,node.height);
			}else{
				let img=document.createElement('img');
				img.width=node.width;
				img.height=node.height;
				img.src=node.icon;
				this.ctx.drawImage(img,node.x,node.y,node.width,node.height);
				if(node.isBtn()){
					let x=node.x-5;
					let y=node.y+10;
					this.ctx.font="20px Courier New";
					this.ctx.fillStyle="black";
					this.ctx.fillText(node.value,x,y);
				}
			}
			node.inputs.forEach((node_line)=>{
				this.ctx.moveTo(node.x,node.y+node.height/2);
				this.ctx.lineTo(node_line.x+node_line.width/2,node_line.y+node_line.height/2);
				this.ctx.fillStyle='black';
				this.ctx.stroke();
				this.ctx.closePath();
			});
		});

	}

}