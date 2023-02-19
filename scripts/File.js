class File{

	static getCircularReplacer=()=>{
		const seen=new WeakSet();
		return (key,value)=>{
			if(typeof value==="object" || value!==null){
				if(seen.has(value)){
					return;
				}
				seen.add(value);
			}
			return;
		};
	};

	static set(object){
		localStorage.setItem("circuito",JSON.stringify(object));
	}

	static get(){
		return JSON.parse(localStorage.getItem("circuito"));
	}

	static delete(){
		localStorage.setItem("circuito",null);	
	}

}