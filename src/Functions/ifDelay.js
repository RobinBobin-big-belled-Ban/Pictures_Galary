export default function ifDelay(value, randomTag) {
	return value.toLowerCase() === "delay" ? randomTag : value; 
}