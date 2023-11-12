import { AddLetterResult, SliceMatchResult, StringEndPosition } from "../types/types";

export const shuffle = <T>(words: Array<T>): Array<T> => {
	return [...words].sort(() => Math.random() - .5);
}

export const getSubstringSliceMatches = (word: string, wordpart: string): SliceMatchResult => {
	return {
		fullWord: word,
		wordpart,
		matches: [...word.matchAll(new RegExp(wordpart, 'g'))].map(i => i.index) as number[]
	}
}

export const getValidLettersToAdd = (word: string, wordpart: string)
	: Array<AddLetterResult> => {

	const matchResults = getSubstringSliceMatches(word, wordpart);

	return matchResults.matches
		.map(i => [
			{ index: i - 1, position: StringEndPosition.Head },
			{ index: i + wordpart.length, position: StringEndPosition.Tail }
		])
		.flat()
		.filter(result => result.index >= 0 && result.index < word.length)
		.map(result => ({
			letter: word[result.index],
			position: result.position,
			source: matchResults.fullWord,
			isBluff: false
		}));
}

export const getAllValidLettersToAdd = (wordpart: string, lexicon: Array<string>)
	: Array<AddLetterResult> => {

	const validLettersToAdd = lexicon
		.filter(word => word.includes(wordpart)) // word.length > MinimumWordLength &&
		.map(word => getValidLettersToAdd(word, wordpart))
		.flat()
		.filter(result => !doesLetterCompleteWord(wordpart, result, lexicon));

	return validLettersToAdd;
}

export const getBestLettersToAdd = (wordpart: string, lexicon: Array<string>, excludeFullwords = true)
	: Array<AddLetterResult> => {

	const allResults = getAllValidLettersToAdd(wordpart, lexicon)
		.filter(result => !(excludeFullwords && result.source.length === wordpart.length + 1));
	const bestLength = Math.max(...allResults.map(r => r.source.length));

	return allResults.filter(r => r.source.length === bestLength);
}

export const getBotLetterToAdd = (wordpart: string, lexicon: Array<string>)
	: Array<AddLetterResult> => {

	const bestValidLetters = getBestLettersToAdd(wordpart, lexicon)
		.filter(result => result.source.length !== wordpart.length + 1);
	if (bestValidLetters.length > 0) {
		return bestValidLetters;
	}

	return getBestBluffLettersToAdd(wordpart, lexicon);
}

export const getBestBluffLettersToAdd = (wordpart: string, lexicon: Array<string>)
	: Array<AddLetterResult> => {

	let bluffs: Array<AddLetterResult> = [];
	let substringLength = wordpart.length - 1;

	while (bluffs.length === 0 && substringLength > 0) {
		const headWordpart = wordpart.substring(0, substringLength);
		const endWordpart = wordpart.substring(wordpart.length - substringLength);

		bluffs = [
			...getAllValidLettersToAdd(headWordpart, lexicon).filter(word => word.position === StringEndPosition.Head),
			...getAllValidLettersToAdd(endWordpart, lexicon).filter(word => word.position === StringEndPosition.Tail),
		]
			.filter(result => result.source.length !== wordpart.length + 1)
			.filter(result => !doesLetterCompleteWord(wordpart, result, lexicon))
			.map(result => ({ ...result, isBluff: true }));

		substringLength--;
	}

	return bluffs;
}

const doesLetterCompleteWord = (wordpart: string, result: AddLetterResult, lexicon: Array<string>) => {
	if (wordpart.length + 1 === result.source.length) {
		return true;
	}
	const potentialNewWordPart = result.position === StringEndPosition.Head
		? result.letter + wordpart
		: wordpart + result.letter;

	return lexicon.includes(potentialNewWordPart);
}

const getPlayerAwayByN = (n: number) => {
	return (turnOrder: Array<string>, playerName: string) => {
		const i = turnOrder.findIndex(p => p === playerName);
		return turnOrder[(i + turnOrder.length + n) % turnOrder.length];
	}
}

export const getPreviousPlayer = getPlayerAwayByN(-1);
export const getNextPlayer = getPlayerAwayByN(1);
