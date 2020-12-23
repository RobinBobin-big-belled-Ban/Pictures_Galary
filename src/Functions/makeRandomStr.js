export default function makeRandomStr(min,max) {
	let str = ""
	let possibleValues = "abcdefghigklmnopqrstuvwxz"
	let maxLength = Math.floor(min - 0.5 + Math.random() * (max - min + 1))
	for (let i = 0; i < maxLength; i++) {
		str += possibleValues[Math.floor(Math.random() * possibleValues.length)]
	}
	return str
}