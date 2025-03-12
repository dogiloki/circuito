class Node{

	static logic_gate={
		and:'and',
		nand:'nand',
		or:'or',
		nor:'nor',
		exor:'exor',
		inverter:'inverter',
		led:'led'
	};

	static logic_gate_icon={
		on:{
			and:'assets/and_on.png',
			nand:'assets/nand_on.png',
			or:'assets/or_on.png',
			nor:'assets/nor_on.png',
			exor:'assets/exor_on.png',
			inverter:'assets/inverter_on.png',
			led:'assets/led.png'
		},
		off:{
			and:'assets/and_off.png',
			nand:'assets/nand_off.png',
			or:'assets/or_off.png',
			nor:'assets/nor_off.png',
			exor:'assets/exor_off.png',
			inverter:'assets/inverter_off.png',
			led:'assets/led.png'
		}
	};

	static btn_icon={
		on:'assets/btn_on.png',
		off:'assets/btn_off.png'
	};

	constructor(value=null){
		this.id=Symbol();
		this.value=value;
		this.status=false;
		this.logic_gate=null;
		this.inputs=[];
		this.outputs=[];
		// Coordenadas en el canvas
		this.x=0;
		this.y=0;
		// Tamaño en graficos
		this.width=30;
		this.height=30;
		this.icon=null;
		this.logic();
		this.changeStatus(this.status);
	}

	setLogicGate(logic_gate){
		this.logic_gate=logic_gate;
		this.logic();
		this.changeStatus(this.status);
	}

	isBtn(){
		return this.logic_gate==null;
	}

	addInput(node){
		this.inputs.push(node);
		node.logic();
	}

	addOutput(node){
		this.outputs.push(node);
		node.getOutput().logic();
	}

	getOutput(node=this){
		return (node.outputs.length<=0)?node:this.getOutput(node.outputs[0]);
	}

	changeStatus(status=null){
		this.status=(status==null)?(this.logic()?false:true):status;
		if(this.isBtn()){
			this.icon=this.status?Node.btn_icon.on:Node.btn_icon.off;
		}else{
			this.icon=this.status?Node.logic_gate_icon.on[this.logic_gate]:Node.logic_gate_icon.off[this.logic_gate];
		}
	}

	logic(){
		if(this.logic_gate==null){
			this.changeStatus(this.status);
			return this.status;
		}
		let status=this.status;
		let value="";
		let count=0;
		switch(this.logic_gate){
			case Node.logic_gate.and:
				count=0;
				value+="(";
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
					value+=node.value+"*";
				});
				value=value.substring(0,value.length-1);
				value+=")";
				status=(count==this.inputs.length && count>1);
				break;
			case Node.logic_gate.nand:
				count=0;
				value+="[<div class='negative'>!(";
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
					value+=node.value+"*";
				});
				value=value.substring(0,value.length-1);
				value+=")</div>]";
				status=count==0?true:count!=this.inputs.length;
				break;
			case Node.logic_gate.or:
				count=0;
				value+="(";
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
					value+=node.value+"+";
				});
				value=value.substring(0,value.length-1);
				value+=")";
				status=count>=1;
				break;
			case Node.logic_gate.nor:
				count=0;
				value+="[<div class='negative'>!(";
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
					value+=node.value+"+";
				});
				value=value.substring(0,value.length-1);
				value+=")</div>]";
				status=!(count>=1);
				break;
			case Node.logic_gate.exor:
				count=0;
				value+="(";
				this.inputs.forEach((node,index)=>{
					if(node.logic()){
						count++;
					}
					value+=(index==0?"":"<div class='negative'>!")+node.value;
					value+=(index==0?"":"</div>");
					value+="*";
				});
				value=value.substring(0,value.length-1);
				value+="+";
				this.inputs.forEach((node,index)=>{
					value+=(index==0?"<div class='negative'>!":"")+node.value;
					value+=(index==0?"</div>":"");
					value+="*";
				});
				value=value.substring(0,value.length-1);
				value+=")";
				status=(count<=1 && count!=0);
				break;
			case Node.logic_gate.inverter:
				value+="[<div class='negative'>!(";
				this.inputs.forEach((node)=>{
					status=node.logic();
					value+=node.value;
				});
				value+=")</div>]";
				status=this.inputs<=0?true:status?false:true;
				break;
			case Node.logic_gate.led:
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
					value+=node.value;
				});
				status=count>=1;
			default: break;
		}
		this.outputs.forEach((node)=>{
			node.logic();
		});
		this.value=value;
		this.changeStatus(status);
		return status;
	}

}