class Table{

	constructor(nodes_btn=[],node_output=null){
		this.base=2;
		this.nodes_btn=nodes_btn;
		this.max=nodes_btn.length;
		this.rows=Math.pow(this.base,this.max);
		this.node_output=node_output;
		this.letters=[]
		this.bits=this.generateBits();
		this.values=[];
		this.outputs=[];
	}

	generateTable(){
		for(let row=0; row<=this.rows; row++){
			let value=[];
			for(let column=0; column<this.max; column++){
				let status=this.divide(row,column)%this.base;
				this.letters[column]=this.nodes_btn[column].value;
				this.nodes_btn[column].status=status==0?false:true;
				value[column]=status;
			}
			this.outputs[row]=this.node_output==null?null:this.node_output.logic()?1:0;
			this.values[row]=value;
		}
	}

	divide(value,n){
		if(n==0){
			return value;
		}
		value/=this.base;
		value=Math.floor(value);
		n--;
		return n<=0?value:this.divide(value,n);
	}

	generateBits(){
		let bits=[];
		//let letters=[];
		for(let a=0; a<this.max; a++){
			bits.push(Math.pow(this.base,a));
			//letters.push(String.fromCodePoint(65+a));
		}
		/*return{
			'bits':bits,
			'letters':letters
		};*/
		return bits;
	}	
	
}