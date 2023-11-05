import React from 'react';
import './App.css'
import { Player, GameState, ActionType, RAction, StringEndPosition } from '../types/generalTypes';
import { AddLetterButton } from './AddLetterButton';
import { getBotLetterToAdd, getNextPlayer, getPreviousPlayer } from '../services/botService';
import { lexicon } from '../data/words';

function App() {
  const initialPlayers: Record<string, Player> = {
    'patrick': {isHuman: true, name: 'patrick', losses: 0},
    'olimar': {isHuman: false, name: 'olimar', losses: 0},
    'ears': {isHuman: false, name: 'ears', losses: 0},
  };

  const initialTurnOrder = [
    'patrick',
    'olimar',
    'ears',
  ];

  const initialState : GameState = {
    word: '',
    players: initialPlayers,
    turnOrder: initialTurnOrder,
    currentPlayer: initialTurnOrder[0],
    gameSpeed: 400,
    log: [],
    isActiveChallenge: false,
  }

  const [state, dispatch] = React.useReducer((state: GameState, action: RAction) : GameState => {
    switch(action.type) {
      case ActionType.Challenge:
        {
          const challengedPlayer = getPreviousPlayer(state.turnOrder, state.currentPlayer);
  
          return {
            ...state,
            currentPlayer: challengedPlayer,
            isActiveChallenge: true,
            log: [...state.log, state.currentPlayer + ' challenged ' + challengedPlayer]
          }
        }
      case ActionType.AddLetter:
        {
          const nextPlayer = getNextPlayer(state.turnOrder, state.currentPlayer);
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
            return {
              ...state,
              word: '',
              players: {
                ...state.players,
                [state.currentPlayer]: {
                  ...state.players[state.currentPlayer],
                  losses: state.players[state.currentPlayer].losses + 1
                }
              },
              currentPlayer: state.turnOrder[0],
              log: [...state.log, state.currentPlayer + ' completed a word and lost! ' + newWord]
            }
          }
          
          return {
            ...state,
            word: newWord,
            currentPlayer: nextPlayer,
            log: [...state.log, state.currentPlayer + ' added the letter ' + action.payload.letter]
          }
        }
      case ActionType.ResolveChallengeWithDefeat:
        return {
          ...initialState,
          players: {
            ...state.players,
            [state.currentPlayer]: {
              ...state.players[state.currentPlayer],
              losses: state.players[state.currentPlayer].losses + 1 
            }
          },
          log: [...state.log, state.currentPlayer + ' had no word in mind, and loses the challenge']
        };
      case ActionType.ResolveChallengeWithWord:
        {
          const challengingPlayer = getNextPlayer(state.turnOrder, state.currentPlayer);
          return {
            ...initialState,
            players: {
              ...state.players,
              [challengingPlayer]: {
                ...state.players[challengingPlayer],
                losses: state.players[challengingPlayer].losses + 1 
              }
            },
            log: [...state.log, `${state.currentPlayer} refutes with ${action.payload.word} -- ${challengingPlayer} loses the challenge`]
          };
        }
    }
    
  }, initialState);

  // Defines the actions that bots takes and under what conditions
  // also defines the time interval that spaces out those actions
  React.useEffect(() => {
    if(!state.players[state.currentPlayer].isHuman && state.word !== '') {
      const timeoutId = setTimeout(() => {
        if(state.isActiveChallenge) {
          // AI is responding to a challenge
          // they can either admit defeat or respond with a valid word
          const validWords = lexicon.filter(word => word.includes(state.word)) 
          if(validWords.length > 0) {
            dispatch({
              type: ActionType.ResolveChallengeWithWord,
              payload: {
                word: validWords[0],
              }});
          }
          else {
            dispatch({
              type: ActionType.ResolveChallengeWithDefeat,
              payload: null
            });
          }
        } 
        else {
          const botsLetterResults = getBotLetterToAdd(state.word, lexicon);
          const {letter, position} = botsLetterResults[0];
  
          dispatch({
            type: ActionType.AddLetter,
            payload: {
              letter,
              position,
            }});
        }
      }, state.gameSpeed);

      return () => clearTimeout(timeoutId);
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
                <AddLetterButton 
                  dispatch={dispatch} 
                  position={StringEndPosition.Head}
                  disabled={!state.players[state.currentPlayer].isHuman}
                  hotkey=" ">
                  +
                </AddLetterButton>
              </>
              :
              <>
                <AddLetterButton 
                  dispatch={dispatch} 
                  position={StringEndPosition.Head}
                  disabled={!state.players[state.currentPlayer].isHuman}
                  hotkey="ArrowLeft">
                  &#8592;
                </AddLetterButton>
                <p className='currentWord'>
                  {state.word}
                </p>
                <AddLetterButton 
                  dispatch={dispatch} 
                  position={StringEndPosition.Tail}
                  disabled={!state.players[state.currentPlayer].isHuman}
                  hotkey="ArrowRight">
                  &#8594;
                </AddLetterButton>
              </>
          }
        </div>
        <button 
          disabled={state.word.length === 0 || !state.players[state.currentPlayer].isHuman || state.isActiveChallenge}
          onClick={() => dispatch({type: ActionType.Challenge, payload: null})}>
          challenge
        </button>
      </section>
      <section className='section'>
        <h2>players</h2>
        <ul className='playerList'>
          {
            state.turnOrder.map(player => state.players[player]).map(player =>
              <div key={player.name}>
                {player.name === state.currentPlayer ? '>  ' : ''}
                {player.name} ({player.losses})
                {player.name === state.currentPlayer ? '  <' : ''} 
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
