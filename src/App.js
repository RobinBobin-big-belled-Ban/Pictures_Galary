import React from 'react'
import Input from './components/Input'
import './index.css'
import concatArrays from './Functions/concatArrays'
import makeRandomStr from './Functions/makeRandomStr'
import ifDelay from './Functions/ifDelay'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      tag: "",
      imgUrls: [],
      isGrouped: false,
      toGroupTags: [],
      blockButton: false,
    }
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onClickHandlerLoad = this.onClickHandlerLoad.bind(this)
    this.onClickHandlerClear = this.onClickHandlerClear.bind(this)
    this.onClickHandlerGroup = this.onClickHandlerGroup.bind(this)
    this.onImgClickHandler = this.onImgClickHandler.bind(this)
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this)
  }
  onChangeHandler(event) {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  onClickHandlerLoad(event) {
    const {tag, imgUrls} = this.state
    this.setState({blockButton: true,})
    const imgUrlsArray = imgUrls
    //Использую тернарный оператор. Если поле ввода тега пустое,
    //то отображается всплывающее уведомление "заполните поле 'тег'",
    if (!tag) {
      alert("Введи наименование тега") 
      this.setState({blockButton: false,})
    }else{
      //Строка Tag (используется для поиска изображений) разделяется на массив
      //строк. Необхлдимо для работы с групповым тегом
      let tagArray = tag.split(',').filter(item => item !== undefined ? item : null)
      let array = []
      for(let i = 0; i < tagArray.length; i++) {
        fetch(`https://api.giphy.com/v1/gifs/random?api_key=gTJAO48YcpmrADUyo4opy4ES4g7iDBxx&tag=${ifDelay(tagArray[i],makeRandomStr(1,10))}`)
        .then(response => response.json())
        .then(response => {
          array = [...array, response.data.image_url]
          if (i === (tagArray.length-1)) {
            imgUrlsArray.push({urls: array, tagname: tag,})
            this.setState({
                  imgUrls: imgUrlsArray,
                  blockButton: false,
                })
          }
          //Проверка. Если ничего не найдено, то появляется уведомление
          if (response.data.image_url === undefined) {
            imgUrlsArray.pop()
            alert("По запросу ничего не найдено!")
            this.setState({blockButton: false, tag: ''})
          }
        })
       .catch(err => {
          alert("Возникла ошибка!!")
          this.setState({blockButton: false,})
       })
      }
    }
  }

  onClickHandlerClear(event) {
    this.setState({
      tag: "",
      imgUrls: [],
      toGroupTags: [],
    })
  }

  onClickHandlerGroup(event) {
    const {isGrouped, imgUrls} = this.state
    // Изменил массив объектов, чтобы сгрупировать все адреса URL с идентичными ТЕГАМИ   
    const newImgUrl = [...imgUrls].map((item) => { 
        const itemArr = []
        for (let elem of item.urls) {
          itemArr.push(elem)
        }
        return {
          name: item.tagname,
          url: itemArr
        }
    })
    // Использую new Map() для того, чтобы отсортировать все совпадающие значения.
    const map = new Map() 
    for (let arr of newImgUrl) {
      if (map.has(arr.name)) {
        let arrMap = [...map.get(arr.name), arr.url]
          map.set(arr.name, arrMap)
      }else{
        map.set(arr.name, [arr.url])
        }
    }
    //Использую функцию для преобразования многомерного массива
    //в удобный для работы массив
    const array = concatArrays(Array.from(map))
    
    this.setState({
        isGrouped: !isGrouped,
        toGroupTags: array,
      })
  }

  onImgClickHandler(event) {
    const { target } = event
   if (target.hasAttribute("alt")) {
      this.setState({tag: target.name})
    }
  }

  onKeyDownHandler(event) {
    const { tag } = this.state
    const regExp=/[A-Za-z,]/g
    const correct = tag.match(regExp) || [];
    const correctTag = correct.join('')
    this.setState(prev => ({tag: correctTag}))
  }

  render() {
    //получаю свойства объекта ES6
    const {tag, imgUrls, isGrouped, toGroupTags, blockButton} = this.state 

    const galary = imgUrls.map((imgUrl,index) => {
       return <div id="l0_b1" key={index} style={{border: "solid 1px black", width: "auto"}}>
                  {/*<p>{imgUrl.tagname}</p>*/}
                  {imgUrl.urls.map((item,ind) => {
                    return <div key={ind}>
                        <img src={item} name={imgUrl.tagname} alt="imagine" style={{}}/>
                    </div>
                  })}
              </div>
    })

    const isGroupedGalary = toGroupTags.map((item,index) => {
      //Добавил несколько стилей для наглядности
      return <div key={index} style={{border: "1px gray dashed", marginBottom: "30px"}}>
                <h1>{item[0]}</h1>
                {item[1].map((item,index) => {
                  return <div id="l0_b1" key={index} >
                            <img src={item} alt="imagine"/>
                        </div>
                      })}
                  </div>
    })
    
    return (
      <div onClick={this.onImgClickHandler}>
        <Input 
          onKeyDownHandler={this.onKeyDownHandler}
          onChangeHandler={this.onChangeHandler}
          tag={tag}
        />
        <button onClick={this.onClickHandlerLoad} disabled={blockButton || isGrouped}>Загрузить</button>
        <button onClick={this.onClickHandlerClear}>Очистить</button>
        <button onClick={this.onClickHandlerGroup}>{isGrouped ? "Разгруппировать" : "Группировать"}</button>
        <br />
        {isGrouped ? isGroupedGalary : (!blockButton ? galary : "Загрузка...")}
      </div>

    )
  }
}

export default App;
