import './styles.css';

import ReactDOM from 'react-dom';
import React from 'react';
import Todo from '../models/todo';
import Create from './components/create';
import List from './components/list';
import {  connect, ObserveObject  } from 'ylem';
import {  getAsync  } from 'ylem/property-decorators';
import route from 'can-route';

class TodoMVCStore extends ObserveObject {
	@getAsync
	get todosList() {
		if (!route.data.filter) {
			return Todo.getList({});
		}
		else { 
			return Todo.getList({ filter: { complete: route.data.filter === 'complete' } });
		}
	}
	get allChecked() {
		return this.todosList && this.todosList.allComplete;
	}
	set allChecked(newVal) {
		this.todosList && this.todosList.updateCompleteTo(newVal);
	}
}

const TodoMVC = ({ todosList, allChecked, appRoute }) => {
	return (
		<section id='todoapp'>
			<header id='header'>
				<h1>todos</h1>
				<Create />
			</header>
			<section id='main'>
				<input
					id='toggle-all'
					type='checkbox'
					checked={allChecked ? true : false}
					disabled={todosList && todosList.saving.length}
				/>
				<label htmlFor='toggle-all'>Mark all as complete</label>
				<List todos={todosList}  />   
			</section>
			<footer id='footer'>
				<span id='todo-count'>
					<strong>{ todosList && todosList.active.length }</strong> items left
				</span>
				<ul id='filters'>
					<li>
						<a
							onClick={() => appRoute.filter = ''}
							className={appRoute.filter === '' ? 'selected' : ''}
						>All
						</a>
					</li>
					<li>
						<a
							onClick={() => appRoute.filter = 'active'}
							className={appRoute.filter === 'active' ? 'selected' : ''}
						>Active
						</a>
					</li>
					<li>
						<a
							onClick={() => appRoute.filter = 'complete'}
							className={appRoute.filter === 'complete' ? 'selected' : ''}
						>Completed
						</a>
					</li>
				</ul>

				<button 
					id='clear-completed'
					onClick={() => todosList.destroyComplete()}
				>
					Clear completed ({ todosList && todosList.complete.length })
				</button>
			</footer>
		</section>
	); 
};

const App = connect(TodoMVCStore)(TodoMVC);
export default App;

class RouteStore extends ObserveObject {
	filter = '';
}


route.data = new RouteStore();
route.start();

const div = document.createElement('div');
document.body.appendChild(div);

ReactDOM.render(<App appRoute={route.data} />, div);