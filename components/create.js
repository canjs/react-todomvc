import React from 'react';
import Todo from '../models/todo';
import { connect, ObserveObject } from 'ylem';

class CreateStore extends ObserveObject {
	todo = new Todo({ name: '' });
	createTodo = e => {
		e && e.preventDefault();
		this.todo.save().then(() => {
			this.todo = new Todo({ name: '' });
		});
	}
}

const Create = ({ todo, createTodo }) => (
	<form onSubmit={createTodo}>
		<input 
			id='new-todo'
			placeholder='What needs to be done?'
			onChange={(e) => {
				if (!todo.isSaving()) {
					todo.name = e.target.value;
				} 
			}}
			value={todo.name}
		/>
	</form>
);

export default connect(CreateStore)(Create);