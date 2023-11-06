import React, { FormEvent } from 'react';
import './App.css'
import { Player, GameState, ActionType, RAction, StringEndPosition } from '../types/generalTypes';
import { AddLetterButton } from './AddLetterButton';
import { getBotLetterToAdd, getNextPlayer, getPreviousPlayer } from '../services/botService';
import { big_words as lexicon } from '../data/big_words';

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
    humanChallengeResponseWord: ''
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
            log: [
              state.currentPlayer + ' challenged ' + challengedPlayer,
              ...state.log, 
            ]
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
              log: [
                state.currentPlayer + ' completed a word and lost! ' + newWord,
                ...state.log, 
              ]
            }
          }
          
          return {
            ...state,
            word: newWord,
            currentPlayer: nextPlayer,
            log: [
              state.currentPlayer + ' added the letter ' + action.payload.letter,
              ...state.log, 
            ]
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
          log: [
            state.currentPlayer + ' had no word in mind, and loses the challenge',
            ...state.log,
          ]
        };
      case ActionType.ResolveChallengeWithWord:
        {
          const challengingPlayer = getNextPlayer(state.turnOrder, state.currentPlayer);
          
          const isValidWord = action.payload.word.includes(state.word)   
            && (lexicon.includes(action.payload.word) || big_words.includes(action.payload.word));

          if(isValidWord) {
            return {
              ...initialState,
              players: {
                ...state.players,
                [challengingPlayer]: {
                  ...state.players[challengingPlayer],
                  losses: state.players[challengingPlayer].losses + 1 
                }
              },
              log: [
                `${state.currentPlayer} refutes with ${action.payload.word} -- ${challengingPlayer} loses the challenge`,
                ...state.log,
              ]
            };
          } else {
            return {
              ...initialState,
              players: {
                ...state.players,
                [state.currentPlayer]: {
                  ...state.players[state.currentPlayer],
                  losses: state.players[state.currentPlayer].losses + 1 
                }
              },
              log: [
                `${state.currentPlayer} refutes with ${action.payload.word}, which is not a valid word -- ${state.currentPlayer} loses the challenge`,
                ...state.log,
              ]
            };
          }
        }
      case ActionType.SetHumanChallengeResponseWord:
        return {
          ...state,
          humanChallengeResponseWord: action.payload.word 
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
          const previousPlayer = state.players[getPreviousPlayer(state.turnOrder, state.currentPlayer)];
          
          const botsLetterResults = getBotLetterToAdd(state.word, lexicon);
          const {letter, position, isBluff} = botsLetterResults[0];
          
          // if the previous player is the human, and the bot has to bluff,
          // that means there are no valid words
          // in this case, the bot will challenge the player rather than bluff itself

          if(previousPlayer.isHuman && isBluff) {
            dispatch({type: ActionType.Challenge, payload: null})
          }
          else {
            // this could be 
            dispatch({
              type: ActionType.AddLetter,
              payload: {
                letter,
                position,
              }});
          }
        }
      }, state.gameSpeed);

      return () => clearTimeout(timeoutId);
    }
  }, [state])

  const handleHumanChallengeWordSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    dispatch({
      type: ActionType.ResolveChallengeWithWord,
      payload: {
        word: state.humanChallengeResponseWord
      }
    })
  }

  

  return (
    <div className='appContainer'>
      <h1>ghosts</h1>
      <section className='section'>
        <div className='currentWordContainer'>
          {
            state.word === ''
              ?
              <>
                <AddLetterButton 
                  dispatch={dispatch} 
                  position={StringEndPosition.Head}
                  disabled={!state.players[state.currentPlayer].isHuman || state.isActiveChallenge}
                  hotkey=" ">
                  +
                </AddLetterButton>
              </>
              :
              <>
                <AddLetterButton 
                  dispatch={dispatch} 
                  position={StringEndPosition.Head}
                  disabled={!state.players[state.currentPlayer].isHuman || state.isActiveChallenge}
                  hotkey="ArrowLeft">
                  &#8592;
                </AddLetterButton>
                <p className='currentWord'>
                  {
                    [...state.word].map(c => {
                      return <span className='currentWord--letter'>{c}</span>
                    })
                  }
                </p>
                <AddLetterButton 
                  dispatch={dispatch} 
                  position={StringEndPosition.Tail}
                  disabled={!state.players[state.currentPlayer].isHuman || state.isActiveChallenge}
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
        {
          state.isActiveChallenge &&
          <>
            <form onSubmit={handleHumanChallengeWordSubmit}>
              <label>
                you've been challenged, what word did you have in mind? <br/>
                <input 
                  value={state.humanChallengeResponseWord} 
                  autoFocus
                  onChange={(e) => dispatch({
                  type: ActionType.SetHumanChallengeResponseWord,
                  payload: {
                    word: e.target.value
                  }
                })}></input>
                <button type='submit'>answer</button>
              </label>
            </form>

            <button onClick={() => dispatch({type: ActionType.ResolveChallengeWithDefeat, payload: null})}>
              admit defeat
            </button>
          </>
        }
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
