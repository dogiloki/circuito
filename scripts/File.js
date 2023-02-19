class File{

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