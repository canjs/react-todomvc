import "./styles.css";

import ReactDOM from "react-dom";
import React from "react";
import Todo from "../models/todo";
import Create from "./components/create";
import List from "./components/list";
import { connect, ObserveObject } from "ylem";
import { getAsync } from 'ylem/property-decorators';
import route from "can-route";

class Store extends ObserveObject {
    @getAsync
	get todosList() {
		if(!route.data.filter) {
			return Todo.getList({});
		}
		else {
			return Todo.getList({ filter: {complete: route.data.filter === "complete" }});
		}
	}
	get allChecked() {
		return this.todosList && this.todosList.allComplete;
	}
	set allChecked(newVal) {
		this.todosList && this.todosList.updateCompleteTo(newVal);
    }
}

const TodoMVC = ({todosList, allChecked}) => {
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
                checked={ allChecked ? true : false }
                disabled={ todosList && todosList.saving.length }
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
        <List todos={ todosList } length={ todosList ? todosList.length : 0} />   
        </section>
        <footer id="footer">
            <span id="todo-count">
                <strong>{todosList && todosList.active.length}</strong> items left
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
                onClick={ () => todosList.destroyComplete() }>
                Clear completed ({todosList && todosList.complete.length})
            </button>
        </footer>
    </section>
);}

const App = connect(Store)(TodoMVC);
export default App;

route.data = Store;
route.register("{filter}");
route.start();

var div = document.createElement('div');
document.body.appendChild(div);

ReactDOM.render(<App />, div);