const Input = (props) => {
	return(
		<form >
          <input 
            onKeyUp={props.onKeyDownHandler}
            type="text"
            name="tag" 
            onChange={props.onChangeHandler}
            value={props.tag}
          />
        </form>
	)
}

export default Input