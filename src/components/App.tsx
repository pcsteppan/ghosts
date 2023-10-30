import React from 'react';
import './App.css'
// import common_words from './words';
import { Player, GameState, ActionType, RAction, StringEndPosition } from '../types/generalTypes';
import { AddLetterButton } from './AddLetterButton';
import { getAllValidLettersToAdd } from '../services/botService';
import { lexicon } from '../data/words';
// import { getValidAction } from './services/botService';

function App() {
  const initalPlayers: Array<Player> = [
    {isHuman: true, name: 'patrick', losses: 0},
    {isHuman: false, name: 'olimar', losses: 0}
  ];

  const initialState : GameState = {
    word: '',
    players: initalPlayers,
    currentPlayer: initalPlayers[0],
    gameSpeed: 2000,
    log: []
  }

  const [state, dispatch] = React.useReducer((state: GameState, action: RAction) : GameState => {
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

          switch(action.payload.position) {
            case StringEndPosition.Head:
              newWord = action.payload.letter + state.word;
              break;
              case StringEndPosition.Tail:
              newWord += action.payload.letter;
              break;
          }

          if(lexicon.includes(newWord)) {
            
            const newPlayers = [...state.players];
            const index = newPlayers.findIndex(p => p === state.currentPlayer);
            console.log(newPlayers[index].losses);
            newPlayers[index].losses += 1;
            
            return {
              ...state,
              word: '',
              players: newPlayers,
              currentPlayer: state.players[0],
              log: [...state.log, state.currentPlayer.name + ' completed a word and lost! ' + newWord]
            }
          }
          
          return {
            ...state,
            word: newWord,
            currentPlayer: nextPlayer,
            log: [...state.log, state.currentPlayer.name + ' added the letter ' + action.payload.letter]
          }
        }
      default:
        return {...state};
    }
  }, initialState);

  // take AI turn
  React.useEffect(() => {
    if(!state.currentPlayer.isHuman && state.word !== '') {
      setTimeout(() => {
        // randomGoalWord = shuffle(common_words.filter(word => word.includes(state.word)))
        const validLettersToAdd = getAllValidLettersToAdd(state.word, lexicon);

        if(validLettersToAdd.length > 0) {
          const {letter, position} = validLettersToAdd[0];
          dispatch({
            type: ActionType.AddLetter,
            payload: {
              letter,
              position
            }
          })
        } else {
          // challenge player
          // try bluffing
        }
      }, state.gameSpeed);
    }
  }, [state])

  return (
    <div className='appContainer'>
      <h1>ghosts</h1>
      <section className='section'>
        {/* <h2>current word</h2> */}
        <div className='currentWordContainer'>
          {
            state.word === ''
              ?
              <>
                <AddLetterButton dispatch={dispatch} position={StringEndPosition.Head}/>
              </>
              :
              <>
                <AddLetterButton dispatch={dispatch} position={StringEndPosition.Head}/>
                <p className='currentWord'>
                  {state.word}
                </p>
                <AddLetterButton dispatch={dispatch} position={StringEndPosition.Tail}/>
              </>
          }
        </div>
        <button>
          challenge
        </button>
      </section>
      <section className='section'>
        <h2>players</h2>
        <ul className='playerList'>
          {
            state.players.map(player => 
              <div key={player.name}>
                {player === state.currentPlayer ? '>  ' : ''}
                {player.name} ({player.losses})
                {player === state.currentPlayer ? '  <' : ''} 
              </div>
              )
          }
        </ul>
      </section>
      <section>
        <h2>logs</h2>
        <ul className='logs'>
          {
            state.log.map((m, i) => 
              <div key={i}>
                {m}
              </div>
              )
          }
        </ul>
      </section>
    </div>
  )
}

export default App
