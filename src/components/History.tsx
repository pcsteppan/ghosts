import { getNextPlayer, getPreviousPlayer } from "../services/botService";
import { ActionType, History } from "../types/types";

export function HistoryComponent({history} : {history: History}) {
	const viewFromHistory = ({history}: History) => {
		
		console.log('----------------');
		return history.map(({action, snapshot}) => {
			console.log({action, snapshot});
			switch (action.type) {
				case ActionType.AddLetter:
					console.log('addletter');
					return `${snapshot.currentPlayer}: ${snapshot.word}`;
				case ActionType.Challenge:
					console.log('challenge')
					return `${snapshot.currentPlayer} challenged ${getPreviousPlayer(snapshot.turnOrder, snapshot.currentPlayer)}`
				default:
					return;
			}
		})
	} 

	return (
	<section>
        <h2>history</h2>
        <ul className='history'>
          {
            viewFromHistory(history).reverse() .map((m, i) => 
              <div key={i}>
                {m}
              </div>
              )
          }
        </ul>
      </section>
	)
}
