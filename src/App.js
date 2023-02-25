import { useState } from 'react'
import './App.css'
const icons = {
  play: "https://cdn-icons-png.flaticon.com/128/565/565296.png",
  playing: "https://cdn-icons-png.flaticon.com/128/483/483365.png"
}
const App = () => {
  const [input, SetInput] = useState("")
  const [status, SetStatus] = useState(false)
  const [response, SetResponse] = useState([])
  const [playIcon, SetPlayIcon] = useState(icons.play)
  const [clicked, SetClicked] = useState(false)
  const search = async (e) => {
    e.preventDefault()
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
    const response = await res.json()
    SetStatus(true)
    if ('title' in response) {
      SetResponse(response)
      return
    }
    let audio = ''
    for (let i of response[0].phonetics) {
      if (i.audio !== '') {
        audio = i.audio
        break
      }
    }
    const updatedData = {
      Input: input,
      partOfSpeech: response[0].meanings[0].partOfSpeech,
      phonetic: response[0].phonetic,
      audio: audio,
      definition: response[0].meanings[0].definitions[0].definition,
      example: response[0].meanings[0].definitions[0].example
    }
    SetResponse(updatedData)
  }
  const playSound = () => {
    SetPlayIcon(icons.playing)
    SetClicked(true)

  }
  const audioEnded = () => {
    SetPlayIcon(icons.play)
    SetClicked(false)
  }
  const resultData = () => {
    if ('title' in response) {
      return (
        <div className='result-container'>
          <p className='emoji'>😣</p>
          <p className='title'>{response.title}</p>
          <p>{response.resolution}</p>
        </div>
      )
    }
    else {
      const { Input, partOfSpeech, phonetic, audio, definition, example } = response
      return (
        <div className='result-container'>
          <div>
            <h2>{Input}</h2>
            {audio !== '' &&
              <>
                <audio src={clicked ? audio : null} autoPlay onEnded={audioEnded} />
                <img src={playIcon} className='sound-img' alt='sound' onClick={playSound} />
              </>
            }
          </div>
          <p>{partOfSpeech} {phonetic}</p>
          <p className='definition'>{definition}</p>
          <p className={example !== undefined ? 'example' : null}>{example}</p>
        </div>
      )
    }

  }
  return (
    <div className="bg-container">
      <div className='dictionary'>
        <div className='logo'>
          <img src='https://cdn-icons-png.flaticon.com/128/4720/4720477.png' alt='logo' />
        </div>
        <div className='search-container'>
          <form onSubmit={search}>
            <input placeholder='Type word here..' onChange={(e) => SetInput(e.target.value)} value={input} />
            <button>search</button>
          </form>
        </div>
        {status && resultData()}
      </div>
    </div>
  )
}
export default App