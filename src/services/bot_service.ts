import { Action, ActionType, AddLetterType, GameState, SliceMatchResult } from "../types/general_types";

const MinimumWordLength = 3;

export const getValidAction = (gameState: GameState, lexicon: Array<string>): Action => {
	const valid_words = lexicon
		.filter(word => word.includes(gameState.word) && word.length > MinimumWordLength)
		.sort((a, b) => b.length - a.length);

	if (valid_words.length === 0) {
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
	if (head_char_index >= 0 && Math.random() < .5) {
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

const shuffle = (words: Array<string>): Array<string> => {
	return [...words].sort(() => Math.random() - .5);
}

export const getSubstringSliceMatches = (word: string, query: string): SliceMatchResult => {
	return {
		fullWord: word,
		query,
		matches: [...word.matchAll(new RegExp(query))].map(i => i.index) as number[]
	}
}