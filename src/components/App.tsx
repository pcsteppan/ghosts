import React, { FormEvent } from 'react';
import './App.css'
import { ActionType, RAction, StringEndPosition, AppState } from '../types/types';
import { AddLetterButton } from './AddLetterButton';
import { getBestBotLettersToAdd, getPreviousPlayer, shuffle } from '../services/botService';
import { HistoryComponent } from './History';
import { initialAppState, reduceOnAppAction } from './AppReducer';
import { lexicon } from '../data/lexicon';
import { PlayerComponent } from './PlayerComponent';

function App() {
  const [state, dispatch] = React.useReducer((state: AppState, action: RAction) : AppState => {
    const newState = reduceOnAppAction(state, action);
    return {
      ...newState,
      history: [
        ...state.history,
        {
          action,
          snapshot: newState
        }
      ]
    }
    
  }, initialAppState);

  // Defines the actions that bots takes and under what conditions
  // also defines the time interval that spaces out those actions
  React.useEffect(() => {
    if(!state.players[state.currentPlayer].isHuman) {
      const timeoutId = setTimeout(() => {
        if(state.isActiveChallenge) {
          // AI is responding to a challenge
          // they can either admit defeat or respond with a valid word
          const validWords = lexicon.filter(word => word.includes(state.word)) 
          if(validWords.length > 0) {
            dispatch({
              type: ActionType.ResolveChallengeWithWord,
              word: validWords[0],
            })
          }
          else {
            dispatch({
              type: ActionType.ResolveChallengeWithDefeat,
            });
          }
        } 
        else {
          const previousPlayer = state.players[getPreviousPlayer(state.turnOrder, state.currentPlayer)];
          
          const botsLetterResults = getBestBotLettersToAdd(state.word, lexicon, state.turnOrder.length);
          const {letter, position, isBluff} = shuffle(botsLetterResults)[0];
          
          // if the previous player is the human, and the bot has to bluff,
          // that means there are no valid words
          // in this case, the bot will challenge the player rather than bluff itself

          if(previousPlayer.isHuman && isBluff) {
            dispatch({type: ActionType.Challenge })
          }
          else {
            // this could be 
            dispatch({
              type: ActionType.AddLetter,
              letter,
              position,
            })
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
      word: state.humanChallengeResponseWord
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
          onClick={() => dispatch({type: ActionType.Challenge })}>
          challenge
        </button>
        {
          state.isActiveChallenge && state.players[state.currentPlayer].isHuman &&
          <>
            <form onSubmit={handleHumanChallengeWordSubmit}>
              <label>
                you've been challenged, what word did you have in mind? <br/>
                <input 
                  value={state.humanChallengeResponseWord} 
                  autoFocus
                  onChange={(e) => dispatch({
                  type: ActionType.SetHumanChallengeResponseWord,
                  word: e.target.value
                })}></input>
                <button type='submit'>answer</button>
              </label>
            </form>

            <button onClick={() => dispatch({ type: ActionType.ResolveChallengeWithDefeat })}>
              admit defeat
            </button>
          </>
        }
      </section>
      <PlayerComponent players={state.players} currentPlayer={state.currentPlayer} turnOrder={state.turnOrder} dispatch={dispatch}/>
      <HistoryComponent history={state} />
    </div>
  )
}

export default App
