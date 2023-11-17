import React from "react";
import { ActionType, Dispatch, GameState } from "../types/types";
import './PlayerComponent.css';

type PlayerState = Pick<GameState, "players" | "turnOrder" | "currentPlayer">;
type PlayerComponentProps = PlayerState & {dispatch: Dispatch};

export function PlayerComponent({players, turnOrder, currentPlayer, dispatch}: PlayerComponentProps) {
	// const  = state;
	console.log({players, turnOrder, currentPlayer})
	
	const [editMode, setEditMode] = React.useState(false);

	return (
		players && turnOrder && currentPlayer &&
		<section className='section'>
        <div className='section--header'>
			<h2>
				players
			</h2>

			<button className='section--edit' onClick={() => setEditMode(!editMode)}>
				{editMode ? "done" : "edit"}
			</button>
		</div>
		{
			editMode
			? (
				<>
					{
						turnOrder.map(player => players[player]).map(player =>
							<div key={player.id}>
								<input 
									key={player.id}
									value={player.name}
									onChange={(e) => 
										dispatch({
											type: ActionType.ChangePlayerName,
											playerId: player.id,
											newName: e.target.value
										})
									}/>
								{
									(turnOrder.length > 1) &&
										<button onClick={() => dispatch({
											type: ActionType.DeletePlayer,
											playerId: player.id
										})}>
											delete
										</button>
								}
							</div>
						)
					}
					<div>
						<button onClick={() => dispatch({type: ActionType.AddPlayer})}>add</button>
					</div>
				</>
			)
			: (
				<ul className='playerList'>
				{
					turnOrder.map(player => players[player]).map(player =>
						<div key={player.name}>
							{player.name === currentPlayer ? '>  ' : ''}
							{player.name} ({player.losses})
							{player.name === currentPlayer ? '  <' : ''} 
						</div>
					)
				}
				</ul>
			)
		}
      </section>
	)
}