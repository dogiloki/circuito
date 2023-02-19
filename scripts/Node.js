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
		this.width=50;
		this.height=50;
		this.icon=null;
		this.changeStatus(false);
	}

	setLogicGate(logic_gate){
		this.logic_gate=logic_gate;
		this.changeStatus(this.output);
	}

	isBtn(){
		return this.logic_gate==null;
	}

	addInput(node){
		this.inputs.push(node);
	}

	addOutput(node){
		this.outputs.push(node);
	}

	getOutput(node=this){
		return (node.outputs.length<=0)?node:this.getOutput(node.outputs[0]);
	}

	changeStatus(status=null){
		this.status=(status==null)?(this.status?false:true):status;
		if(this.isBtn()){
			this.icon=this.status?Node.btn_icon.on:Node.btn_icon.off;
		}else{
			this.icon=this.status?Node.logic_gate_icon.on[this.logic_gate]:Node.logic_gate_icon.off[this.logic_gate];
		}
	}

	logic(){
		if(this.logic_gate==null || this.inputs.length<=0){
			return this.status;
		}
		let status=this.status;
		let count=0;
		switch(this.logic_gate){
			case Node.logic_gate.and:
				count=0;
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
				});
				status=(count==this.inputs.length && count>1);
				break;
			case Node.logic_gate.nand:
				count=0;
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
				});
				status=count!=this.inputs.length;
				break;
			case Node.logic_gate.or:
				count=0;
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
				});
				status=count>=1;
				break;
			case Node.logic_gate.nor:
				count=0;
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
				});
				status=!(count>=1);
				break;
			case Node.logic_gate.exor:
				count=0;
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
				});
				status=(count<=1 && count!=0);
				break;
			case Node.logic_gate.inverter:
				this.inputs.forEach((node)=>{
					status=node.logic();
				});
				status=status?false:true;
				break;
			case Node.logic_gate.led:
				this.inputs.forEach((node)=>{
					if(node.logic()){
						count++;
					}
				});
				status=count>=1;
			default: break;
		}
		this.changeStatus(status);
		return status;
	}

}