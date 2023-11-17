import { expect, test } from 'vitest';
import { getBestBluffLettersToAdd, getBestBotLettersToAdd, getBestLettersToAdd, getBotLetterToAdd, getSubstringSliceMatches, getValidLettersToAdd } from "../botService";
import { StringEndPosition } from '../../types/types';

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
	expect(validLetters).toStrictEqual([{ letter: 'c', position: StringEndPosition.Head, source: word, isBluff: false }]);
})

test('get valid letters to add #1', () => {
	const word = 'cat';

	const validLetters = getValidLettersToAdd(word, 'ca');
	expect(validLetters).toStrictEqual([{ letter: 't', position: StringEndPosition.Tail, source: word, isBluff: false }]);
})

test('get valid letters to add #3', () => {
	const word = 'catats';

	const validLetters = getValidLettersToAdd(word, 'at');
	expect(validLetters).toStrictEqual([
		{ letter: 'c', position: StringEndPosition.Head, source: word, isBluff: false },
		{ letter: 'a', position: StringEndPosition.Tail, source: word, isBluff: false },
		{ letter: 't', position: StringEndPosition.Head, source: word, isBluff: false },
		{ letter: 's', position: StringEndPosition.Tail, source: word, isBluff: false },
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

test('get best bot letters to add, 2 player', () => {
	const lexicon = [
		'bats',   // length 4
		'chats',  // length 5
		'attack', // length 6
	]
	const wordpart = 'at';

	const bestLettersToAddWith3Players = getBestBotLettersToAdd(wordpart, lexicon, 2);
	expect(bestLettersToAddWith3Players.length).toBe(2);
	const letterSet = new Set(bestLettersToAddWith3Players.map(l => l.letter));

	expect(letterSet).toStrictEqual(new Set(['h', 's']));
})

test('get best bot letters to add, 3 player', () => {
	const lexicon = [
		'bats',   // length 4
		'chats',  // length 5
		'attack', // length 6
	]
	const wordpart = 'at';

	const bestLettersToAddWith3Players = getBestBotLettersToAdd(wordpart, lexicon, 3);
	expect(bestLettersToAddWith3Players.length).toBe(3);
	const letterSet = new Set(bestLettersToAddWith3Players.map(l => l.letter));

	expect(letterSet).toStrictEqual(new Set(['b', 's', 't']));
})

test('get bluffs', () => {
	const lexicon = [
		'cat'
	]

	// wordpart that starts with 'at' or ends with 'ca'
	const wordpart = 'ata';

	// a bluff will take the substrings from the start or end of the query
	// progressively slicing off more of the string
	// until valid letters to add can be found in either the head or tail position

	const bestBluffLetters = getBestBluffLettersToAdd(wordpart, lexicon);

	expect(bestBluffLetters.length).toBe(2);
	expect(bestBluffLetters[0].letter).toBe('c');
	expect(bestBluffLetters[1].letter).toBe('t');
})

test('get bot letter to add, bluff', () => {
	const lexicon = [
		'cat'
	]

	// wordpart that starts with 'at' or ends with 'ca'
	const wordpart = 'ata';

	// a bluff will take the substrings from the start or end of the query
	// progressively slicing off more of the string
	// until valid letters to add can be found in either the head or tail position

	const bestBluffLetters = getBotLetterToAdd(wordpart, lexicon);

	expect(bestBluffLetters.length).toBe(2);
	expect(bestBluffLetters[0].letter).toBe('c');
	expect(bestBluffLetters[1].letter).toBe('t');
})

test('get bot letter to add, random valid word', () => {
	const lexicon = [
		'chat',
		'boat',
		'rat'
	]

	// wordpart that starts with 'at' or ends with 'ca'
	const wordpart = 'at';

	// a bluff will take the substrings from the start or end of the query
	// progressively slicing off more of the string
	// until valid letters to add can be found in either the head or tail position

	const bestBluffLetters = getBotLetterToAdd(wordpart, lexicon);

	expect(bestBluffLetters.length).toBe(2);
	expect(bestBluffLetters[0].letter).toBe('h');
	expect(bestBluffLetters[1].letter).toBe('o');
})

test('get bot letter to add, avoid completing word', () => {
	const lexicon = [
		'cat',
		'bat',
		'bats'
	]

	// wordpart that starts with 'at' or ends with 'ca'
	const wordpart = 'at';

	// a bluff will take the substrings from the start or end of the query
	// progressively slicing off more of the string
	// until valid letters to add can be found in either the head or tail position

	const bestBluffLetters = getBotLetterToAdd(wordpart, lexicon);

	expect(bestBluffLetters.length).toBe(1);
	expect(bestBluffLetters[0].letter).toBe('s');
})