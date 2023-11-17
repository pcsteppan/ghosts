import { ActionType, History } from "../types/types";

export function HistoryComponent({history} : {history: History}) {
	const viewFromHistory = ({history}: History) => {
		return history.map(({action, snapshot}, i) => {
			if(i === 0) {return;}
			// the previous player did the action which resulted in the current snapshot
			const previousState = history[i-1];

			switch (action.type) {
				case ActionType.AddLetter:
					// did they complete a word? that is a special case for logging
					return `${snapshot.players[previousState.snapshot.currentPlayer].name}: ${snapshot.word}`;
				case ActionType.Challenge:
					// in the case of a challenge, the 'currentPlayer' is the challneged player
					return `${snapshot.players[previousState.snapshot.currentPlayer].name} challenges ${snapshot.players[snapshot.currentPlayer].name}`
				case ActionType.ResolveChallengeWithDefeat:
					return `${previousState.snapshot.currentPlayer} loses`
				case ActionType.ResolveChallengeWithWord:
					return `${snapshot.players[snapshot.currentPlayer].name} responds with ${action.word}`	
				default:
					return;
			}
		}).filter(history => history)
	} 

	return (
	<section>
        <h2>history</h2>
		<table className='history'>
			{
				viewFromHistory(history).reverse() .map((m, i) => 
				<tr key={i}>
					<td>
					{m}
					</td>
				</tr>
				)
			}
		</table>
      </section>
	)
}
