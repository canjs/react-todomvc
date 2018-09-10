import React from 'react';
import { connect, ObserveObject } from 'ylem';
import TodoList from '../models/todo';

class ListStore extends ObserveObject { 
	todos = new TodoList();
	editing;
	backupName;
	isEditing = todo => {
		return todo === this.editing;
	}
	edit = todo => {
		this.backupName = todo.name;
		this.editing = todo;
	}
	cancelEdit = () => {
		if (this.editing) {
			this.editing.name = this.backupName;
		}
		this.editing = null;
	}
	updateName = e => {
		e && e.preventDefault();
		this.editing.save();
		this.editing = null;
	}
}

const List = ({ todos, isEditing, edit, updateName, cancelEdit }) => {
	return (
		<ul id='todo-list'>
			{ todos && todos.map((todo) => (
				<li 
					key={todo.id} 
					className={[
						'todo',
						todo.complete && 'completed',
						isEditing(todo) && 'editing',
					].filter(v => v).join(' ')}
				>
					<div className='view'>
						<input
							className='toggle'
							type='checkbox'
							checked={todo.complete}
							onChange={() => {
								todo.complete = !todo.complete;
								todo.save();
							}}
						/>
						<label
							onDoubleClick={() => (!todo.isSaving() && !todo.isDestroying()) && edit(todo)}
						>
							{todo.name}
						</label>
						<button
							className='destroy'
							onClick={() => todo.destroy()}
						/>
					</div>
					<form onSubmit={updateName}>
						<input
							className='edit'
							type='text'
							value={todo.name}
							onChange={(e) => todo.name = e.target.value}
							onBlur={cancelEdit}
						/>
					</form>
				</li>
			))}
		</ul>
	);
};

export default connect(ListStore)(List);