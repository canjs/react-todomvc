import React from "react";
import DefineMap from "can-define/map/";
import { Component } from "react-view-model";
import Todo from "../models/todo";

export const ViewModel = DefineMap.extend("TodoCreateVM", {
	todo: { Value: Todo },
});

export default class Create extends Component {
	createTodo(e) {
		e && e.preventDefault();

		this.viewModel.todo.save().then(() => {
			this.viewModel.todo = new Todo();
		});
	}

	render() {
		return (
			<form onSubmit={ (e) => this.createTodo(e) }>
				<input id="new-todo"
					placeholder="What needs to be done?"
					value={this.viewModel.todo.name}
				/>
			</form>
		);
	}
}

Create.ViewModel = ViewModel;
