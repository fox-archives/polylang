from typing import TypedDict


class Root(TypedDict):
	someBoolean: bool
	someInteger: int
	someString: str
	someIntegerEnum: int
	someArrayOfBooleans: list[bool]
	someArrayOfIntegers: list[int]
	someArrayOfStrings: list[str]


