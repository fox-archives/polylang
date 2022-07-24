function c(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

interface IStructStrategy {
	preText(): string
	createStructKeyValue(keyName: string, typeName: string): string
	createStructKeyEnum<T>(keyName: string, enumList: T[]): string
	createStructKeyArray(keyName: string, typeName: string): string
	createStructStart(structName: string): string
	createStructRef(keyName: string, targetStruct: string): string
	createStructEnd(structName: string): string
	getText(): string
}

class StructStrategy {
	protected text = ''

	constructor() {
		this.text = this.preText()
	}

	preText(): string {
		return ''
	}

	getText(): string {
		return this.text
	}
}

type supportedPrimitives = 'boolean' | 'integer' | 'string'

class TypeScriptStructStrategy
	extends StructStrategy
	implements IStructStrategy
{
	t(typeName: supportedPrimitives) {
		if (typeName === 'boolean') {
			return 'boolean'
		} else if (typeName === 'integer') {
			return 'number'
		} else if (typeName === 'string') {
			return 'string'
		}
	}

	createStructKeyValue(keyName: string, typeName: supportedPrimitives): string {
		return `\t${keyName}: ${this.t(typeName)}\n`
	}

	createStructKeyEnum<T>(keyName: string, enumList: T[]): string {
		const elements = enumList.map((item: any) => `'${item}'`).join(' | ')
		return `\t${keyName}: Array<${elements}>\n`
	}

	createStructKeyArray(keyName: string, typeName: supportedPrimitives): string {
		return `\t${keyName}: Array<${this.t(typeName)}>\n`
	}

	createStructStart(structName: string): string {
		return `type ${structName} = {\n`
	}

	createStructRef(keyName: string, targetStruct: string): string {
		return `\t${keyName}: ${targetStruct}\n`
	}

	createStructEnd(_structName: string): string {
		return `}\n\n`
	}
}

class ZodScriptStructStrategy
	extends StructStrategy
	implements IStructStrategy
{
	preText(): string {
		return `import { z } from 'z'\n\n`
	}

	t(typeName: supportedPrimitives) {
		if (typeName === 'boolean') {
			return 'z.boolean()'
		} else if (typeName === 'integer') {
			return 'z.number().int()'
		} else if (typeName === 'string') {
			return 'z.string()'
		}
	}

	createStructKeyValue(keyName: string, typeName: supportedPrimitives): string {
		return `\t${keyName}: ${this.t(typeName)},\n`
	}

	createStructKeyEnum<T>(keyName: string, enumList: T[]): string {
		const elements = enumList.map((item) => `'${item}'`).join(', ')
		return `\t${keyName}: z.enum([${elements}]),\n`
	}

	createStructKeyArray(keyName: string, typeName: supportedPrimitives): string {
		const t = this.t(typeName)
		return `\t${keyName}: z.array(${t}),\n`
	}

	createStructStart(structName: string): string {
		return `const ${structName} = z.object({\n`
	}

	createStructRef(keyName: string, targetStruct: string): string {
		return `\t${keyName}: ${targetStruct}\n`
	}

	createStructEnd(_structName: string): string {
		return `})\n\n`
	}
}

class GoStructStrategy extends StructStrategy implements IStructStrategy {
	#variant

	constructor(
		strategyVariant: 'validator' | 'govalidator' | 'ozzo-validation'
	) {
		super()
		this.#variant = strategyVariant
	}
	preText(): string {
		return `package main\n\n`
	}

	createStructKeyValue(keyName: string, typeName: string): string {
		if (typeName === 'boolean') {
			return `\t${keyName} bool\n`
		} else if (typeName === 'integer') {
			return `\t${keyName} int\n`
		} else if (typeName === 'string') {
			return `\t${keyName} string\n`
		} else {
			throw Error()
		}
	}

	createStructKeyEnum<T>(keyName: string, enumList: T[]): string {
		const enumName = `${keyName}Struct`
		let buf = '' // TODO better name
		buf += `type ${enumName} string\n\n`
		buf += `const (\n`
		for (const value of enumList) {
			if (typeof value === 'string') {
				const v = value as unknown as string
				buf += `\t${c(v)} ${enumName} = "${v}"\n`
			} else {
				console.warn('Not supported')
			}
		}
		buf += `)\n`
		console.log(buf)

		return `\t${keyName} ${enumName}\n`

		return buf
	}

	createStructKeyArray(keyName: string, typeName: string): string {
		if (typeName === 'boolean') {
			return `\t${keyName} []bool\n`
		} else if (typeName === 'integer') {
			return `\t${keyName} []int\n`
		} else if (typeName === 'string') {
			return `\t${keyName} []string\n`
		} else {
			throw Error()
		}
	}

	createStructStart(structName: string): string {
		return `type ${structName} struct {\n`
	}

	createStructRef(keyName: string, targetStruct: string): string {
		return `\t${keyName} ${targetStruct}\n`
	}

	createStructEnd(_structName: string): string {
		return `}\n\n`
	}
}

// class PythonStructStrategy extends StructStrategy implements IStructStrategy {
// 	#text = ''
// 	preText(): string {
// 		return `from typing import TypedDict\n\n`
// 	}
//
// 	createStruct(): string {
// 		this.#text += `class ${c(structName)}(TypedDict):\n`
// 		for (const [memberName, memberObject] of Object.entries(structProperties)) {
// 			if (memberObject.type === 'boolean') {
// 				this.#text += `\t${memberName}: bool\n`
// 			} else if (memberObject.type === 'integer') {
// 				this.#text += `\t${memberName}: int\n`
// 			} else if (memberObject.type === 'string') {
// 				this.#text += `\t${memberName}: str\n`
// 			} else if (memberObject.type === 'array') {
// 				if (memberObject.items.type === 'boolean') {
// 					this.#text += `\t${memberName}: list[bool]\n`
// 				} else if (memberObject.items.type === 'integer') {
// 					this.#text += `\t${memberName}: list[int]\n`
// 				} else if (memberObject.items.type === 'string') {
// 					this.#text += `\t${memberName}: list[str]\n`
// 				}
// 			}
// 		}
// 		this.#text += `\n\n`
// 	}
// }

class StructStrategizer {
	#strategy: IStructStrategy
	content: string[] = []

	constructor(strategy: IStructStrategy) {
		this.#strategy = strategy
	}

	private createStruct(structName: string, structInfo: Record<string, any>) {
		const s = this.#strategy

		let buf = ''
		buf += s.createStructStart(structName)
		for (const [memberName, memberObject] of Object.entries(structInfo)) {
			if (memberObject.type === 'boolean') {
				buf += memberObject.enum
					? s.createStructKeyEnum<boolean>(memberName, memberObject.enum)
					: s.createStructKeyValue(memberName, 'boolean')
			} else if (memberObject.type === 'integer') {
				buf += memberObject.enum
					? s.createStructKeyEnum<number>(memberName, memberObject.enum)
					: s.createStructKeyValue(memberName, 'integer')
			} else if (memberObject.type === 'string') {
				buf += memberObject.enum
					? s.createStructKeyEnum<string>(memberName, memberObject.enum)
					: s.createStructKeyValue(memberName, 'string')
			} else if (memberObject.type === 'array') {
				if (memberObject.items.type === 'boolean') {
					buf += s.createStructKeyArray(memberName, 'boolean')
				} else if (memberObject.items.type === 'integer') {
					buf += s.createStructKeyArray(memberName, 'integer')
				} else if (memberObject.items.type === 'string') {
					buf += s.createStructKeyArray(memberName, 'string')
				}
			} else if (memberObject.type === 'object') {
				const nextStructName = `${c(structName)}${c(memberName)}`
				buf += s.createStructRef(memberName, nextStructName)

				const structText = this.createStruct(
					nextStructName,
					memberObject.properties
				)
				this.content.push(structText)
			}
		}
		buf += s.createStructEnd(structName)

		return buf
	}

	process(object: Record<string, any>): string {
		const buf = this.createStruct('Root', object)
		this.content.push(buf)

		return this.#strategy.preText() + this.content.join('')
	}
}

class Polystruct {
	#schema

	constructor(schema: Record<string, any>) {
		this.#schema = schema
	}

	convert(name: 'typescript' | 'typescript-zod' | 'go' | 'python'): string {
		if (name === 'typescript') {
			const ss = new StructStrategizer(new TypeScriptStructStrategy())
			return ss.process(this.#schema.properties)
		} else if (name === 'typescript-zod') {
			const ss = new StructStrategizer(new ZodScriptStructStrategy())
			return ss.process(this.#schema.properties)
		} else if (name === 'go') {
			const ss = new StructStrategizer(new GoStructStrategy('validator'))
			return ss.process(this.#schema.properties)
		} else if (name === 'python') {
			// const py = new PolyStruct(new PythonStructStrategy())
			// py.process(schemaJson.properties)
			return ''
		} else {
			throw Error()
		}
	}
}

{
	const schemaFile = Deno.args[0]
	const schemaText = await Deno.readTextFile(schemaFile)
	const schemaJson = JSON.parse(schemaText)

	const a = new Polystruct(schemaJson).convert('typescript')
	const b = new Polystruct(schemaJson).convert('typescript-zod')
	const c = new Polystruct(schemaJson).convert('go')

	await Deno.mkdir('./output', { recursive: true })
	await Promise.all([
		Deno.writeTextFile('./output/' + 'struct.ts', a),
		Deno.writeTextFile('./output/' + 'struct2.ts', b),
		Deno.writeTextFile('./output/' + 'struct.go', c),
	])
}
