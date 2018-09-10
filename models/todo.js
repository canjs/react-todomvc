import fixture from 'can-fixture';
import realtimeRestModel from 'can-realtime-rest-model';
import { ObserveObject, ObserveArray } from 'ylem';

class Todo extends ObserveObject {
	id;
	name;
	complete;
}

class TodoList extends ObserveArray {
	get active() {
		return this.filter(todo => !todo.complete);
	}
	get complete() {
		return this.filter(todo => todo.complete);
	}
	get allComplete() {
		return this.length === this.complete.length;
	}
	get saving() {
		return this.filter((todo) => {
			return todo.isSaving();
		});
	}
	updateCompleteTo = (value) => {
		this.forEach((todo) => {
			todo.complete = value;
			todo.save();
		});
	};
	destroyComplete = () => {
		this.complete.forEach((todo) => {
			todo.destroy();
		});
	};
}

Todo.connection = realtimeRestModel({
	Map: Todo,
	List: TodoList,
	url: '/api/todos/{id}',
});

export default Todo;

const todoStore = fixture.store([
	{ name: 'mow lawn', complete: false, id: 5 },
	{ name: 'dishes', complete: true, id: 6 },
	{ name: 'learn canjs', complete: false, id: 7 },
]);
  
fixture('/api/todos/{id}', todoStore);
fixture.delay = 1;