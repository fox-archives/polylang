import { z } from 'z'

const RootSomeObjectSubobj = z.object({
	wha: z.enum(['uwu', 'owo', 'rawr']),
})

const RootSomeObject = z.object({
	key1: z.string(),
	key2: z.number().int(),
	subobj: RootSomeObjectSubobj,
})

const Root = z.object({
	someBoolean: z.boolean(),
	someInteger: z.number().int(),
	someString: z.string(),
	someBooleanEnum: z.enum(['true']),
	someIntegerEnum: z.enum(['0', '3']),
	someStringEnum: z.enum(['a', 'b', 'c']),
	someArrayOfBooleans: z.array(z.boolean()),
	someArrayOfIntegers: z.array(z.number().int()),
	someArrayOfStrings: z.array(z.string()),
	someObject: RootSomeObject,
})
