import React from 'react';
import './App.css'
import common_words from './words';
import { Player, GameState, Action, AddLetterType, ActionType } from './types/general_types';
import { getValidAction } from './services/bot_service';

function App() {
  const initalPlayers: Array<Player> = [
    {isHuman: true, name: 'patrick', losses: 0},
    {isHuman: false, name: 'olimar', losses: 0}
  ];

  const initialState : GameState = {
    word: '',
    players: initalPlayers,
    currentPlayer: initalPlayers[0],
    gameSpeed: 2000
  }

  const [state, dispatch] = React.useReducer((state: GameState, action: Action) => {
    switch(action.type) {
      case ActionType.Challenge:
        console.log('challenge');
        return {
          ...state
        }
      case ActionType.AddLetter:
        {
          const nextPlayer = state.players[(state.players.findIndex(p => p === state.currentPlayer) + 1) % state.players.length];
          let newWord = state.word;

          switch(action.payload.addLetterType) {
            case AddLetterType.Head:
              newWord = action.payload.char + state.word;
              break;
              case AddLetterType.Tail:
              newWord += action.payload.char;
              break;
          }
          
          return {
            ...state,
            word: newWord,
            currentPlayer: nextPlayer
          }
        }
      default:
        return {...state};
    }
  }, initialState);

  // take AI turn
  React.useEffect(() => {
    if(!state.currentPlayer.isHuman) {
      setTimeout(() => {
        // randomGoalWord = shuffle(common_words.filter(word => word.includes(state.word)))
        const nonPlayerAction = getValidAction(state, common_words);
        dispatch(nonPlayerAction)

      }, state.gameSpeed);
    }
  }, [state.currentPlayer, state.word, ActionType, AddLetterType, state.gameSpeed])

  const [charInput, setCharInput] = React.useState('');

  const HandleAddLetter = (char: string, addLetterType: AddLetterType) => {
    // handle char input errors
    // handle not your turn error

    dispatch({
      type: ActionType.AddLetter,
      payload: {char, addLetterType}
    })
  }

  return (
    <>
      <h1>ghosts</h1>
      <section className='section'>
        <h2>current word</h2>
        <p className='currentWord'>
          {state.word.length > 0 && <span className='accentColor'>{charInput} </span>}
          {state.word} 
          {state.word.length > 0 && <span className='accentColor'> {charInput}</span>}
        </p>
      </section>
      <section className='section'>
        <h2>actions</h2>

        <div className='actions-panel'>
          <div className='addLetter-container'>
            <button 
              className='addLetter-btn'
              onClick={() => HandleAddLetter(charInput, AddLetterType.Head)}
              disabled={!state.currentPlayer.isHuman}>
              &lt; add to start
            </button>
            <label>
              <span className='visually-hidden'>new letter:</span>
              <input 
                className='addLetter-input' 
                type='text' 
                value={charInput} 
                onChange={e => {
                  if(e.target.value.length === 1) {
                    setCharInput(e.target.value)
                  } else if (e.target.value.length > 1) {
                    setCharInput(e.target.value[1]);
                  } else {
                    setCharInput('');
                  }
                }}
                disabled={!state.currentPlayer.isHuman} />
            </label>
            <button 
              className='addLetter-btn'
              onClick={() => HandleAddLetter(charInput, AddLetterType.Tail)}
              disabled={!state.currentPlayer.isHuman}>
              add to end &gt;
            </button>
          </div>
          <button className='challenge-btn' onClick={() => dispatch({
            type: ActionType.Challenge,
            payload: {}
          })}>
            challenge!
          </button>
        </div>
      </section>
      <section className='section'>
        <h2>players</h2>
        <ul>
          {
            state.players.map(player => <div key={player.name}>{player === state.currentPlayer ? '>' : ''} {player.name}</div>)
          }
        </ul>
      </section>
    </>
  )
}

export default App
