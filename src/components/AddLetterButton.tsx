import React, { PropsWithChildren } from "react";
import { ActionType, RAction, StringEndPosition } from "../types/generalTypes";
import './AddLetterButton.css';

type AddLetterButtonProps = {
	dispatch: (action: RAction) => void, 
	position: StringEndPosition,
	disabled: boolean,
	hotkey: string
};

export function AddLetterButton({dispatch, position, children, disabled, hotkey}: PropsWithChildren<AddLetterButtonProps>) {
	
	const [acceptInput, setAcceptInput] = React.useState(false);
	const [letterInput, setLetterInput] = React.useState('');

	const handleSetLetterInput = (input: string) => {
		setLetterInput(input.length <= 1 ? input : input[1]);
	}

	const handleSubmitLetter = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log('handling submit letter');
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
	
	React.useEffect(() => {
		const handleKeyDown = (keyEvent: KeyboardEvent) => {
			if(!disabled && keyEvent.key === hotkey) {
				setAcceptInput(true);
				if(inputRef?.current) {
					inputRef.current.focus();
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown);
	
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [hotkey, disabled]);

	const inputRef = React.useRef<HTMLInputElement>(null);

	return (
		<>
			{
				acceptInput
				?
				<form onSubmit={e => handleSubmitLetter(e)} hidden={!acceptInput}>
					<input 
						type='text' 
						className='letterInput'
						disabled={disabled}
						value={letterInput}
						autoFocus
						ref={inputRef}
						onChange={e => handleSetLetterInput(e.target.value)}>
					</input>
				</form>
			:
				<button className='letterButton' onClick={() => setAcceptInput(true)} hidden={acceptInput} disabled={disabled}>
					{
						children ? children : '+'
					}
				</button>
			}
		</>
	)
}