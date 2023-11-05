import { c } from "vitest/dist/reporters-5f784f42.js";
import { AddLetterResult, SliceMatchResult, StringEndPosition } from "../types/generalTypes";

const MinimumWordLength = 3;

const shuffle = (words: Array<string>): Array<string> => {
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
			source: matchResults.fullWord
		}));
}

export const getAllValidLettersToAdd = (wordpart: string, lexicon: Array<string>)
	: Array<AddLetterResult> => {

	const valid_words = lexicon
		.filter(word => word.includes(wordpart)) // word.length > MinimumWordLength &&
		.map(word => getValidLettersToAdd(word, wordpart))
		.flat();

	return valid_words;
}

export const getBestLettersToAdd = (wordpart: string, lexicon: Array<string>)
	: Array<AddLetterResult> => {

	const allResults = getAllValidLettersToAdd(wordpart, lexicon);
	const bestLength = Math.max(...allResults.map(r => r.source.length));

	return allResults.filter(r => r.source.length === bestLength);
}

export const getBestBluffLettersToAdd = (wordpart: string, lexicon: Array<string>)
	: Array<AddLetterResult> => {

	let bluffs: Array<AddLetterResult> = [];
	let substringLength = wordpart.length - 1;

	while (bluffs.length === 0 && substringLength > 0) {
		const headWordpart = wordpart.substring(0, substringLength);
		const endWordpart = wordpart.substring(wordpart.length - substringLength);

		console.log(headWordpart, endWordpart)

		bluffs = [
			...getAllValidLettersToAdd(headWordpart, lexicon).filter(word => word.position === StringEndPosition.Head),
			...getAllValidLettersToAdd(endWordpart, lexicon).filter(word => word.position === StringEndPosition.Tail),
		]

		console.log(bluffs)

		substringLength--;
	}

	return bluffs;
}