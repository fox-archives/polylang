package main

type RootSomeObjectSubobj struct {
	wha whaStruct
}

type RootSomeObject struct {
	key1 string
	key2 int
	subobj RootSomeObjectSubobj
}

type Root struct {
	someBoolean bool
	someInteger int
	someString string
	someBooleanEnum someBooleanEnumStruct
	someIntegerEnum someIntegerEnumStruct
	someStringEnum someStringEnumStruct
	someArrayOfBooleans []bool
	someArrayOfIntegers []int
	someArrayOfStrings []string
	someObject RootSomeObject
}

