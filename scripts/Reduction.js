class Reduction{

	static properties={
		conmutativa:[
			'x+y=y+x','x*y=y*x'
		],
		elemento_neutro:[
			'0+x=x','1*x=x'
		],
		distributiva:[
			'x*(y+z)=(x*y)+(y*z)','x+(y*z)=(x+y)(x+z)'
		],
		asociativa:[
			'x*(y*z)=(x*y)*z','x+(y+z)=(x+y)+z'
		],
		complementario:[
			'x+!(x)=1','x*!(x)=0'
		]
	};

	static theorems={
		idempotencia:[
			'x+x=x','x*x=x'
		],
		identidad:[
			'x+1=0','x*0=0'
		],
		absorcion:[
			'x+x*y=x','x*(x+y)=x'
		],
		morgan:[
			'!(x+y)=!(x)*!(y)','!(x*y)=!(x)+!(y)'
		]
	};

	constructor(formula="((E+F)[!([!(C+D)]+(B!A+!BA))])"){
		
	}

}