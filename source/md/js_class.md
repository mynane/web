#类的介绍
##一、类的三个部分

###构造函数内的
这是提供是列对象复用的

	var Book=function(){
		this.name="a";
		this.age=12;
	}
###构造函数外的
直接通过点语法添加的，实例对象访问不到

	Book.color="red";
###是原型中的
实力化对象可以通过其原型链间接访问到，也是为所有实例化对象所共用的

	Book.prototype.say=function(){}
或：

	Book.prototype={
		say:function(){
		}
	}
##二、js中继承的实现方法
js 常用的继承方法有：原型链继承（对象间的继承）、类式继承（构造函数间的继承）
主要使用js的原型prototype机制或则用apply和call方式实现

###1、原型式继承与类式继承
类式继承实在子类型构造函数的内部调用超类型的构造函数。严格的类式继承并不常见，一般组合使用

	function Super(){
		this.colors=["red","blue"];
	}

	function Sub(){
		Super.call(this);
	}

原型式继承是借助已有的对象创建新的对象，将子类的原型指向父类，就相当于加入了父类这条原型链
为了让子类继承父类的属性（也包括方法），首先需要定义一个构造函数。然而，将父类的新实例赋值给构造函数的原型。

	function Parent()}{
		this.name='mike';
	}
	function Child(){
		this.age=12;
	}
	Child.prototype=new Parent();//Child继承Parent，通过原型，形成链条

	var test=new Child();
	alert(test.age);
	alert(test.name);//得到被继承的属性

	function Brothor(){
		this.weight=60;
	}
	Brother.prototype=new Child();//继续原型链继承
	var brother=new Brother();
	alert(brother.name) //mike
	alert(brother.age); //12

以上原型链继承还缺少一环，那就是Object，所有的构造函数都继承自Object。而继承Object是自动完成的，并不需要我们手动继承，name他们的从属关系是怎么样的呢？
可以通过两种方式确定原型与实例之间的关系，操作符，instanceof和isPrototypeof()方法：

	alert(brother instanceof Object) //true
	alert(test instanceof Brother) //false,test是brother的超类
	alert(brother instanceof Child) //true
	alert(brother instanceof Parent) //true

只要原型链中出现过的原型，都可以说是该原型链派生的实例的原型，因此，isPrototype()方法也会返回true。

在js中，被继承的函数称为超类型（父类，基类也行），继承的函数称为子类型（子类，派生类）。使用原型继承主要由两个问题：
一是字面量重写原型会中断关系，使用引用类型的原型，并且子类型还无法给超类型传递参数。

伪类解决引用共享和超类型无法传参的问题，我们可以采用“借用构造函数”技术

###2、借用构造函数（类继承）
	function Parent(age){
		this.name=["mike","jack","smith"];
		this.age=age;
	}
    
	function Child(age){
		Parent.call(this,age);
	}
	var test=new Child(21);
	alert(test.age);//21
	alert(test.name);//mike,jack,smith
借用构造函数虽然解决了刚才两个问题，但没有原型，复用无从谈起，所以我们需要 原型链+构造函数的模式，这种模式称为‘组合继承’

###3、组合继承
	function Parent(age){
		this.name=["mike","jack","smith"];
		this.age=age;
	}
	Parent.prototype.run=function(){
		return this.name+' are both'+this.age;
	}
	function Child(age){
		Parent.call(this,age);//对象冒充给超类传参
	}
	Child.prototype=new Parent();//原型链继承
	var test=new Child(21);
	alert(test.run());//mike,jack,smith are both21

组合式继承是比较常用的一种继承方法，其背后的思路是 使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。
这样，既通过在原型上定义方法实现了函数复用，又保证每个实例都有它自己的属性。
call()的用法：调用一个对象的一个方法，以另一个对象替换当前对象。
call([thisObj[,arg1[, arg2[, [,.argN]]]]]) 

###4、原型式继承
这种继承借助原型并基于已有的对象创建对象，同时还不用创建自定义类型的方式称为 ‘原型式继承’

	function obj(o){
		function F(){};
		F.prototype=o;
		return new F();
	}
	var box = {
		name:'trigkit4',
		arr:['brother','sister','baba']
	}
	var b1=obj(box);
	alert(b1.name); //trigkit4

	alert(b1.arr); //brother,sister,baba
	b1.arr.push('parents');
	alert(b1.arr); //brother,sister,baba,parents

	var b2=obj(box);
	alert(b2.name); //trigkit4
    alert(b2.arr); //brother,sister,baba,parents
原型式继承首先在obj()函数内部创建一个临时性的构造函数 ，
然后将传入的对象作为这个构造函数的原型，最后返回这个临时类型的一个新实例。

###5、寄生式继承
这种方式是把‘原型式+工场模式’结合起来，目的是为了封装创建的过程

	function create(o){
		var f=obj(o);
		f.run=function(){
			return this.arr;//同样，会共享引用
		}
		return f;
	}

#####组合式继承的小问题
组合继承式js继承最常用的继承方式，但组合继承的超类型在使用过程中会调用两次，一次是创建子类型的时候，一次是子类型构造
函数内部。

	function Parent(name){
		this.name=name;
		this.arr=["哥哥","妹妹","父母"];
	}
	Parent.prototype.run=function(){
		return this.name;
	}
	function Child(name,age){
		Parent.call(this,age);//第二次调用
		this.age=age;
	}
	Child.prototype=new Parent();//第一次调用
以上代码是之前的组合继承，那么寄生组合继承，解决了两次调用的问题

###6、寄生组合继承
	function obj(o){
		function F(){};
		F.prototype=o;
		return new F();
	}
	function create(parent,test){
		var f = obj(parent.prototype); //创建对象
		f.constructor=test; //增强对象
	}
	function Parent(name){
		this.name=name;
		this.arr=['brother','sister','parents'];
	}
	Parent.prototype.run=function(){
		return this.name; 
	}
	function Child(name,age){
		Parent.call(this,name);
		this.age=age;
	}
	create(Parent,Child);//通过这里实现继承
	var test=new Child('trigkit4',21);
	test.arr.push('nephew');
	alert(test.arr);
	alert(test.run()); //只共享了方法

	var test2=new Child('jack',22);
	alert(test2.arr);  //引用问题解决


##六、call和apply
全局函数apply和call可以用来改变函数中this的指向，如下：

	function foo(){
		console.log(this.fruit);
	}
	var fruit="apple";
	var pack={
		fruit:"orange"
	}
	foo.apply(window); //"apple",因此this等于window
	foo.apply(pack); //"orange"
