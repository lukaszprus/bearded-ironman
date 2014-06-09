var ToDoApp = function (root, label) { // root Element and label for local storage

    function index(node) {
        var i = 0;
        while (node = node.previousSibling) {
            if (node.nodeType === 1) {
                i += 1;
            }
        }
        return i;
    }

    function removeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function createHandler() {
        var todo = toDoApp.root.getElementsByClassName('create_todo')[0],
            text = todo.value;

        if (!text.trim()) return;

        localStorageTodos.push({
            text: text,
            done: false
        });

        todo.value = '';

        toDoApp.listTodos();
    }

    function updateHandler() {
        var text = toDoApp.root.getElementsByClassName('update_todo')[0].value;

        if (!text.trim()) return;

        localStorageTodos.update(toDoApp.editIndex, {
            text: text,
            done: false
        });
        toDoApp.loadCreateAndListTodoContainer();
    }

    function deleteHandler() {
        localStorageTodos.remove(index(this.parentNode));
        toDoApp.repeatTodos.removeChild(this.parentNode);
    }

    function editHandler() {
        var ind = index(this.parentNode),
            todo = localStorageTodos.get(ind);
        toDoApp.loadUpdateTodoContainer(todo);
        toDoApp.editIndex = ind;
    }

    function cancelHandler() {
        toDoApp.loadCreateAndListTodoContainer();
    }


    function myAddListener(el, type, fn) {
        if (typeof el.addEventListener !== 'undefined') {
            myAddListener = function (el, type, fn) {
                el.addEventListener(type, fn, false);
            };
        } else if (typeof el.attachEvent !== 'undefined') {
            myAddListener = function (el, type, fn) {
                el.attachEvent('on' + type, fn);
            };
        } else {
            myAddListener = function (el, type, fn) {
                el['on' + type] = fn;
            };
        }
        myAddListener(el, type, fn);
    }


    var localStorageTodos = {
        getAll: function () {
            return JSON.parse(localStorage.getItem(label) || '[]');
        },
        get: function (index) {
            var items = this.getAll();
            return items[index];
        },
        setAll: function (items) {
            localStorage.setItem(label, JSON.stringify(items));
        },
        push: function (item) {
            var items = this.getAll();
            items.push(item);
            this.setAll(items);
        },
        update: function (index, item) {
            var items = this.getAll();
            items[index] = item;
            this.setAll(items);
        },
        remove: function (index) {
            var items = this.getAll();
            items.splice(index, 1);
            this.setAll(items);
        }
    };

    var toDoApp = {

        loadCreateAndListTodoContainer: function () {
            try {
                this.updateTodoContainer = this.root.removeChild(this.updateTodoContainer);
            } catch (e) {}
            this.root.appendChild(this.createAndListTodoContainer);
            this.listTodos();
        },

        loadUpdateTodoContainer: function (todo) {
            try {
                this.createAndListTodoContainer = this.root.removeChild(this.createAndListTodoContainer);
            } catch (e) {}
            this.root.appendChild(this.updateTodoContainer);
            this.root.getElementsByClassName('update_todo')[0].value = todo.text;
        },

        listTodos: function () {
            var repeatTodos = this.repeatTodos;

            removeChildren(repeatTodos);

            var liDocumentFragment = document.createDocumentFragment(),
                i = 0,
                l, li, text, spanDelete, spanEdit, todos = localStorageTodos.getAll();


            for (l = todos.length; i < l; i += 1) {
                li = document.createElement('li');

                spanDelete = document.createElement('span');
                spanDelete.appendChild(document.createTextNode(' done '));

                spanEdit = document.createElement('span');
                spanEdit.appendChild(document.createTextNode(' edit '));

                text = document.createTextNode(todos[i].text);

                li.appendChild(text);
                li.appendChild(spanDelete);
                li.appendChild(spanEdit);

                myAddListener(spanDelete, 'click', deleteHandler);
                myAddListener(spanEdit, 'click', editHandler);

                liDocumentFragment.appendChild(li);
            }

            repeatTodos.appendChild(liDocumentFragment);
        }

    };


    toDoApp.root = root;

    myAddListener(root.getElementsByClassName('create_todo_button')[0], 'click', createHandler);
    myAddListener(root.getElementsByClassName('update_todo_button')[0], 'click', updateHandler);
    myAddListener(root.getElementsByClassName('cancel_todo_button')[0], 'click', cancelHandler);

    toDoApp.updateTodoContainer = toDoApp.root.getElementsByClassName('update_todo_container')[0];
    toDoApp.createAndListTodoContainer = toDoApp.root.getElementsByClassName('create_and_list_todo_container')[0];
    toDoApp.repeatTodos = toDoApp.createAndListTodoContainer.getElementsByClassName('repeat_todos')[0];

    toDoApp.loadCreateAndListTodoContainer();

    return toDoApp;

};

var toDoApp1 = ToDoApp(document.getElementById('toDoApp1'), 'toDoApp1');

var toDoApp2 = ToDoApp(document.getElementById('toDoApp2'), 'toDoApp2');