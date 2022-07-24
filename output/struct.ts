type RootSomeObjectSubobj = {
	wha: Array<'uwu' | 'owo' | 'rawr'>
}

type RootSomeObject = {
	key1: string
	key2: number
	subobj: RootSomeObjectSubobj
}

type Root = {
	someBoolean: boolean
	someInteger: number
	someString: string
	someBooleanEnum: Array<'true'>
	someIntegerEnum: Array<'0' | '3'>
	someStringEnum: Array<'a' | 'b' | 'c'>
	someArrayOfBooleans: Array<boolean>
	someArrayOfIntegers: Array<number>
	someArrayOfStrings: Array<string>
	someObject: RootSomeObject
}

