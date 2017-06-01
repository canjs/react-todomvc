import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import route from "can-route";
import DefineMap from "can-define/map/";
import { Component } from "react-view-model";
import Create from "./components/create";
import List from "./components/list";
import Todo from "./models/todo";

export const ViewModel = DefineMap.extend('AppVM', {
	filter: "string",
	get todosPromise() {
		if(!this.filter) {
			return Todo.getList({});
		}
		else {
			return Todo.getList({ complete: this.filter === "complete" });
		}
	},
	todosList: {
		get: function(lastSetValue, resolve) {
			this.todosPromise.then(resolve);
		}
	},
	get allChecked() {
		return this.todosList && this.todosList.allComplete;
	},
	set allChecked(newVal) {
		this.todosList && this.todosList.updateCompleteTo(newVal);
	}
});

export default class App extends Component {
	render() {
		return (
			<section id="todoapp">
				<header id="header">
					<h1>todos</h1>
					<Create />
				</header>

				<section id="main">
					<input
						id="toggle-all"
						type="checkbox"
						checked={ this.viewModel.allChecked ? true : false }
						disabled={ this.viewModel.todosList && this.viewModel.todosList.saving.length }
					/>
					<label htmlFor="toggle-all">Mark all as complete</label>
					<List todos={ this.viewModel.todosList } />
				</section>

				<footer id="footer">
					<span id="todo-count">
						<strong>{this.viewModel.todosList && this.viewModel.todosList.active.length}</strong> items left
					</span>

					<ul id="filters">
						<li>
							<a
								href={route.url({ filter: undefined })}
								className={ route.current({ filter: undefined }) ? "selected" : "" }
								>All</a>
						</li>
						<li>
							<a
								href={route.url({ filter: "active" })}
								className={ route.current({ filter: "active" }) ? "selected" : "" }
								>Active</a>
						</li>
						<li>
							<a
								href={route.url({ filter: "complete" })}
								className={ route.current({ filter: "complete" }) ? "selected" : "" }
								>Completed</a>
						</li>
					</ul>

					<button id="clear-completed"
						onClick={ () => this.viewModel.todosList.destroyComplete() }>
						Clear completed ({this.viewModel.todosList && this.viewModel.todosList.complete.length})
					</button>
				</footer>
			</section>
		);
	}
}

App.ViewModel = ViewModel;

var div = document.createElement('div');
document.body.appendChild(div);

ReactDOM.render(<App ref={register} />, div);

function register(app) {
	route.data = app.viewModel;
	route("{filter}");
	route.ready();
}
