class Util{

	static modal(content,visible=-1){
		content.style.display=(visible==-1)?
							((content.style.display=="none")?"":"none"):
							(visible)?"":"none";
	}

	static cambiarSigno(num){
		return (num>0)?-num:num;
	}

	static convertText(texto){
		return texto.codePointAt(0)-64;
	}

	static convertNum(num){
		return String.fromCodePoint(num+64);
	}

	static changeNum(actual,min,max,direccion=Util.IZQ){
		if(direccion==Util.IZQ){
			if(actual<max){
				actual++;
			}else{
				actual=min;
			}
		}else
		if(direccion==Util.DER){
			if(actual>min){
				actual--;
			}else{
				actual=max;
			}
		}
		return actual;
	}

	static numRandom(max,min=0){
		return Math.round(Math.random()*(max-min)+min);
	}

}