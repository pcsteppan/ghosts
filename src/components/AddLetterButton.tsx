import React from "react";
import { ActionType, StringEndPosition } from "../types/generalTypes";
import './AddLetterButton.css';

export function AddLetterButton({dispatch, position}: {dispatch: (action: any) => void, position: StringEndPosition}) {
	
	const [acceptInput, setAcceptInput] = React.useState(false);
	const [letterInput, setLetterInput] = React.useState('');

	const handleSetLetterInput = (input: string) => {
		setLetterInput(input.length <= 1 ? input : input[1]);
	}

	const handleSubmitLetter = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log(e);

		if(letterInput.length !== 1 || !acceptInput) {
			return;
		}

		dispatch({
			type: ActionType.AddLetter,
			payload: {
				letter: letterInput,
				position: position
			}
		});

		setAcceptInput(false);
		setLetterInput('');
	}

	return (
		<>
			{
				acceptInput
				?
				<form onSubmit={e => handleSubmitLetter(e)} hidden={!acceptInput}>
					<input 
						type='text' 
						className='letterInput'
						value={letterInput}
						autoFocus
						onChange={e => handleSetLetterInput(e.target.value)}>
					</input>
				</form>
			:
				<button onClick={() => setAcceptInput(true)} hidden={acceptInput}>
					+
				</button>
			}
		</>
	)
}