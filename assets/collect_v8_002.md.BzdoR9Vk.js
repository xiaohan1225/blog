import{_ as t,c as o,o as r,ae as e}from"./chunks/framework.BHrE6nLq.js";const b=JSON.parse('{"title":"002 JavaScript函数有什么特点？","description":"","frontmatter":{"title":"002 JavaScript函数有什么特点？","date":"2021-04-16T00:00:00.000Z","categories":["JavaScript"],"tags":["JS引擎V8"],"sidebar":"auto"},"headers":[],"relativePath":"collect/v8/002.md","filePath":"collect/v8/002.md"}'),s={name:"collect/v8/002.md"};function n(i,a,c,l,d,p){return r(),o("div",null,a[0]||(a[0]=[e('<h2 id="javascript中对象" tabindex="-1">javascript中对象 <a class="header-anchor" href="#javascript中对象" aria-label="Permalink to &quot;javascript中对象&quot;">​</a></h2><p>javascript是一门<strong>基于对象</strong>（<strong>Object-Based</strong>）的语言，javascript中的大部分内容都是由对象构成的，比如object、function、Array等都是对象，其本质是<strong>一组组属性和值组成的集合</strong>。</p><h3 id="为什么js不是一门面向对象的语言" tabindex="-1">为什么js不是一门面向对象的语言？ <a class="header-anchor" href="#为什么js不是一门面向对象的语言" aria-label="Permalink to &quot;为什么js不是一门面向对象的语言？&quot;">​</a></h3><ul><li>面向对象的语言天生就支持<strong>封装</strong>，<strong>继承</strong>，<strong>多态</strong>，而js中没有直接提供多态的支持。</li><li>js的继承方式和面向对象语言的继承方式有很大的差别。面向对象语言对继承做了充分的支持，提供了如public、protected、friend、interface等大量关键字，众多的关键字使得它们的继承变得异常复杂和繁琐，而js实现继承则显得格外简单清爽。<strong>只是在对象中添加了一个称为原型的私有属性，把继承的对象通过原型链关联起来，就实现了继承，我们把这种继承方式称为原型链继承。</strong></li></ul><h3 id="js对象使用广泛的原因" tabindex="-1">js对象使用广泛的原因 <a class="header-anchor" href="#js对象使用广泛的原因" aria-label="Permalink to &quot;js对象使用广泛的原因&quot;">​</a></h3><p>对象的属性值可以是<strong>原始类型</strong>，<strong>对象类型</strong>和<strong>函数类型</strong>。</p><h2 id="函数的本质" tabindex="-1">函数的本质 <a class="header-anchor" href="#函数的本质" aria-label="Permalink to &quot;函数的本质&quot;">​</a></h2><ol><li>可以被调用，函数也可以自调用，自执行的匿名函数也被称为IIFE（立即调用函数表达式）</li></ol><blockquote><p>函数可调用的原因：函数除了拥有常用类型的属性值之外，还拥有两个隐藏属性，分别是name属性和code属性。匿名函数的name值为anonymous，code值表示函数代码，以字符串的形式存储在内存中，函数调用时取出code值解释执行。</p></blockquote><ol start="2"><li>函数是一等公民 在js中函数一种特殊的对象，函数可以赋值给变量，可以作为函数参数，可以做成函数的返回值，**如果某个编程语言的函数，可以和这个语言的数据类型做同样的事情，我们就把这个语言中的函数称为一等公民。**支持函数是一等公民的语言，可以让语言代码逻辑更加清晰，代码更加简洁。 但是由于函数的可调用性，使得函数可赋值、可传参和可作为返回值等特性变得有一点麻烦，这是为什么呢？ 我们知道，在执行js函数的过程中，为了实现变量的查找，v8会维护一个作用域链，如果函数中使用了某个变量，而函数内部又没有这个变量，这时候v8就会沿着作用域链去外部的作用域查找该变量，具体流程如下图所示：</li></ol><div class="img-box">![图片加载失败](../../assets/images/js/v8/查找变量.jpg)</div> 从图中可以看出，当函数内部引用了外部变量时，使用这个函数赋值、传参或作为返回值，你需要保证函数内部引用的外部变量时确定存在的，这就是函数作为一等公民麻烦的地方，因为虚拟机还要处理函数引用的外部变量。我们来看一段简单的代码： ```js function foo(){ var number = 1 function bar(){ number++ console.log(number) } return bar } var mybar = foo() mybar() ``` <p>我们定义了一个foo函数，其内部声明了一个bar函数，并将其作为foo函数的返回值，bar函数内部引用了foo中的函数变量number，当调用foo函数后，会返回bar函数。 所谓“函数是一等公民”就体现在，如果函数返回bar函数给外部，那么即使foo函数被销毁了，其中的number变量也不能被销毁，因为bar函数引用了该变量。 我们把这种外部变量和函数绑定起来的技术成为<strong>闭包</strong>。 另外基于函数是一等公民，我们可以轻松使用JavaScript来实现目前比较流行的<strong>函数式编程</strong>。</p>',13)]))}const u=t(s,[["render",n]]);export{b as __pageData,u as default};
