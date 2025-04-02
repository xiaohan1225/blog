## class的基本用法、继承、类型约束、implements

## class的修饰符 readonly private protected public
- private: 只能在当前类内部使用
- protected: 只能在当前类内部和子类中使用
- public(默认): 可以在当前类和子类中使用，也可以在实例中使用
- readonly: 只读属性，只能在声明时或构造函数中赋值

## super
`super`代表父类，先有父后有字，所以需要在子类的构造函数中调用`super`，且必须写在第一行。

可以理解成`父类的prototype.constructor.call`

## static
可以使用`static`修饰属性和方法，静态属性和方法只能通过类名来调用，不能通过实例来调用。


## get set

## 类使用泛型

## 抽象类
不能被实例化，abstract修饰的方法不能实现，使用子类继承抽象类，需要实现抽象类定义的抽象方法。
```ts
abstract class Animal {
}
```