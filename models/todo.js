import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import fixture from "can-fixture";
import realtimeRestModel from "can-realtime-rest-model";

const Todo = DefineMap.extend('Todo', {
	id: "string",
	name: "string",
	complete: {
		type: "boolean",
		default: false
	}
});

Todo.List = DefineList.extend('TodoList', {
	"#": Todo,
	get active() {
		return this.filter({ complete: false });
	},
	get complete() {
		return this.filter({ complete: true });
	},
	get allComplete() {
		return this.length === this.complete.length;
	},
	get saving() {
		return this.filter(function(todo) {
			return todo.isSaving();
		});
	},
	updateCompleteTo: function(value) {
		this.forEach(function(todo) {
			todo.complete = value;
			todo.save();
		});
	},
	destroyComplete: function() {
		this.complete.forEach(function(todo) {
			todo.destroy();
		});
	}
});

Todo.connection = realtimeRestModel({
	Map: Todo,
    List: Todo.List,
    url: "/api/todos/{id}",
});

export default Todo;

const todoStore = fixture.store([
    { name: "mow lawn", complete: false, id: 5 },
    { name: "dishes", complete: true, id: 6 },
    { name: "learn canjs", complete: false, id: 7 }
  ]);
  
  fixture("/api/todos/{id}", todoStore);
  fixture.delay = 1000;