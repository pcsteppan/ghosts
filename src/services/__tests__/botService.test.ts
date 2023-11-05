import { expect, test } from 'vitest';
import { getBestBluffLettersToAdd, getBestLettersToAdd, getSubstringSliceMatches, getValidLettersToAdd } from "../botService";
import { StringEndPosition } from '../../types/generalTypes';

test('is true', () => {
	expect(true).toBeTruthy();
})

test('get substring all matches', () => {
	const word = 'abab_ab';
	//		      ^ ^  ^
	//            0123456
	const matches = getSubstringSliceMatches(word, 'ab');
	expect(matches.matches).toStrictEqual([0, 2, 5]);
})

test('get valid letters to add #1', () => {
	const word = 'cat';

	const validLetters = getValidLettersToAdd(word, 'at');
	expect(validLetters).toStrictEqual([{ letter: 'c', position: StringEndPosition.Head, source: word }]);
})

test('get valid letters to add #1', () => {
	const word = 'cat';

	const validLetters = getValidLettersToAdd(word, 'ca');
	expect(validLetters).toStrictEqual([{ letter: 't', position: StringEndPosition.Tail, source: word }]);
})

test('get valid letters to add #3', () => {
	const word = 'catats';

	const validLetters = getValidLettersToAdd(word, 'at');
	expect(validLetters).toStrictEqual([
		{ letter: 'c', position: StringEndPosition.Head, source: word },
		{ letter: 'a', position: StringEndPosition.Tail, source: word },
		{ letter: 't', position: StringEndPosition.Head, source: word },
		{ letter: 's', position: StringEndPosition.Tail, source: word },
	]);
})

test('get best letters to add', () => {
	const worseWord = 'half';
	const betterWord = 'behalf';
	const query = 'al';

	const bestValidLetters = getBestLettersToAdd(query, [worseWord, betterWord]);

	for (const result of bestValidLetters) {
		expect(result.source).toBe(betterWord);
	}
})

test('get best bluff', () => {
	const lexicon = [
		'cat'
	]

	// wordpart that starts with 'at' or ends with 'ca'
	const wordpart = 'ata';

	// a bluff will take the substrings from the start or end of the query
	// progressively slicing off more of the string
	// until valid letters to add can be found in either the head or tail position

	const bestBluffLetters = getBestBluffLettersToAdd(wordpart, lexicon);

	expect(bestBluffLetters.length).toBe(1);
	expect(bestBluffLetters[0].letter).toBe('c');

})