import React from 'react';
import './App.css'
import common_words from './words';

function App() {

  type Player = {
    isHuman: boolean,
    name: string,
    losses: number 
  }

  type GameState = {
    word: string;
    players: Array<Player>;
    currentPlayer: Player;
    gameSpeed: number;
  }
  
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

  enum ActionType {
    Challenge,
    AddLetter,
  }

  enum AddLetterType {
    Head,
    Tail
  }

  type Action = {
    type: ActionType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any
  }

  const shuffle = (words: Array<string>) : Array<string> => {
    return [...words].sort(() => Math.random() - .5);
  }
  
  const getValidAction = (gameState: GameState, lexicon: Array<string>) : Action => {
    const valid_words = lexicon.filter(word => word.includes(gameState.word) && word.length > 3).sort((a, b) => b.length - a.length);
    console.log(valid_words);
  
    if(valid_words.length === 0) {
      // bluff...
      return {
        type: ActionType.AddLetter,
        payload: {
          char: 'e',
          addLetterType: AddLetterType.Tail
        }
      }
    }
  
    const chosen_goal_word = shuffle(valid_words)[0];
    const game_word_index = chosen_goal_word.indexOf(gameState.word);
    const head_char_index = game_word_index - 1;
    const tail_char_index = game_word_index + gameState.word.length;
    
    let payload = {};
    if(head_char_index >= 0 && Math.random() < .5) {
      payload = {
        addLetterType: AddLetterType.Head,
        char: chosen_goal_word.charAt(head_char_index)
      }
    } else {
      payload = {
        addLetterType: AddLetterType.Tail,
        char: chosen_goal_word.charAt(tail_char_index)
      }
    }

    return {
      type: ActionType.AddLetter,
      payload
    };
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
  const [startEndHoverState, setStartEndHoverState] = React.useState('');

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
