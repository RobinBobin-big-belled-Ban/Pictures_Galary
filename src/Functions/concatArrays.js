export default function concatArrays(array) {
		let newArr = array.map((item, index, ar) => {
			//console.log(item)
			return item.map((elem, ind, arr) => {
				if (Array.isArray(elem)) {
					let elemArr = []
					for (let e of elem) {
						for (let i = 0; i < e.length; i++) {
							elemArr.push(e[i])
						}
					}
					return elemArr
				}else{
					return elem
				  }
			})
		})
		return newArr
	}


