let isUpdate = false
let isEdit = false
let selectedProjectId = null
let selectedTodoId = null

const projects = (function () {
    let list = [];
    let selectedProject = null;
    const add = (project) => {
        list.push(project)
    }
    const edit = (id, project) => {
        list[id] = project
    }
    const getAll = () => {
        return list
    }
    const getProject = (id) => {
        return list[id]
    }
    const get = (id = null) => {
        if (id !== null) {
            return getProject(id)
        }
        return getAll()
    }
    const remove = (projectId) => {
        list = list.filter((project, id) => id !== projectId)
    }
    const getSelectedProject = () => selectedProject
    const setSelectedProject = (project) => selectedProject = project
    return {
        add,
        edit,
        get,
        remove,
        setSelectedProject,
        getSelectedProject
    }
})()

const todos = (function () {
    let todos = []
    const add = (todo) => {
        todos.push(todo)
    }
    const get = () => todos
    const edit = (id, todo) => {
        todos[id] = todo
    }
    const remove = (todoId) => {
        todos = todos.filter((todo, id) => id !== todoId)
    }
    const removeByProject = (projectId) => {
        todos = todos.filter((todo) => todo.projectId !== projectId)
    }
    return {
        add,
        edit,
        get,
        remove,
        removeByProject
    }
})()

const display = (function () {
    const addProjectDialog = document.querySelector("#add-project-dialog");
    const showButton = document.querySelector(".add-project");
    const closeButton = document.querySelector("#add-project-dialog .close");
    // const projectNameInputEl = document.querySelector('.project-name-input')

    const addTodoDialog = document.querySelector("#add-todo-dialog");
    const showTodoButton = document.querySelector(".add-todo");
    const closeTodoButton = document.querySelector("#add-todo-dialog .close");
    // const todoTitleInput = document.querySelector('.todo-title-input')

    const updateProjectList = () => {
        const projectList = projects.get()
        const projectListElement = document.querySelector(".project-list")
        projectListElement.textContent = ''
        projectList.forEach((project, index) => {
            const projectListItem = document.createElement("li")
            const projectNameSpan = document.createElement('span')
            projectNameSpan.textContent = project.name
            projectListItem.appendChild(projectNameSpan)
            projectListItem.classList.add('project')

            const editProjectButton = document.createElement('button')
            editProjectButton.textContent = 'Edit'
            editProjectButton.classList.add('edit-project')
            // editProjectButton.setAttribute('data-id', index)

            editProjectButton.addEventListener('click', function () {
                projectNameInput.value = project.name
                isUpdate = true
                selectedProjectId = index
                addProjectDialog.showModal()
            })

            projectListItem.appendChild(editProjectButton)

            if (project.isDefault === false) {
                const deleteProjectButton = document.createElement('button')
                deleteProjectButton.textContent = 'Delete'
                deleteProjectButton.classList.add('delete-project')
                // deleteProjectButton.setAttribute('data-id', index)

                deleteProjectButton.addEventListener('click', function () {
                    projects.remove(index)
                    todos.removeByProject(index)
                    // updateProjectList()
                    // updateTodoList()
                })

                projectListItem.appendChild(deleteProjectButton)
            }
            projectListElement.appendChild(projectListItem)
        })

        const projectListItems = document.querySelectorAll(".project-list li")
        projectListItems.forEach((projectListItem, index) => {
            projectListItem.addEventListener('click', function () {
                projectListItems.forEach((p) => p.classList.remove('selected'))
                this.classList.add('selected')
                selectedProjectId = index
                projects.setSelectedProject(this.querySelector('span').textContent)
                display.update()
            })
        })
    }

    const updateProjectTitle = () => {
        const projectTitleElement = document.querySelector('.project-title')
        projectTitleElement.textContent = projects.get(selectedProjectId)?.name
    }

    const updateTodoList = () => {
        const todoList = document.querySelector('.todos ul')
        todoList.innerHTML = ''
        const projectTodos = todos.get().filter((todo) => todo.projectId === selectedProjectId)
        const Priority = {
            0: "Low",
            1: "Medium",
            2: "High"
        }
        projectTodos.forEach((todo, index) => {
            const todoListItem = document.createElement('li')
            const todoItem = document.createElement('div')
            const todoHeader = document.createElement('div')
            todoHeader.classList.add('todo-header')
            const todoTitle = document.createElement('h3')
            const todoEditButton = document.createElement('button')
            todoEditButton.textContent = 'Edit'
            todoEditButton.classList.add('todo-edit')
            const todoDeleteButton = document.createElement('button')
            todoDeleteButton.textContent = 'Delete'
            todoDeleteButton.classList.add('todo-delete')
            todoHeader.append(todoTitle, todoEditButton, todoDeleteButton)
            todoTitle.textContent = todo.title
            const todoContent = document.createElement('div')
            todoContent.classList.add('todo-content')
            const todoDescription = document.createElement('p')
            todoDescription.classList.add('todo-description')
            todoDescription.textContent = todo.description
            const todoDueDate = document.createElement('p')
            todoDueDate.classList.add('todo-due-date')
            if (todo.dueDate !== '') {
                const dueDate = new Date(todo.dueDate)
                todoDueDate.textContent = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`
            }
            const todoPriority = document.createElement('p')
            todoPriority.classList.add('todo-priority')
            todoPriority.textContent = Priority[todo.priority]
            todoListItem.classList.add(Priority[todo.priority].toLowerCase())
            const todoProject = document.createElement('p')
            todoProject.classList.add('todo-project')
            todoProject.textContent = projects.get()[selectedProjectId].name
            todoContent.append(todoDescription, todoDueDate, todoPriority, todoProject)
            todoItem.appendChild(todoHeader)
            todoItem.appendChild(todoContent)
            todoListItem.appendChild(todoItem)
            todoList.appendChild(todoListItem)

            todoEditButton.addEventListener('click', function () {
                document.querySelector('.title-input').value = todo.title
                document.querySelector('.description-input').value = todo.description
                document.querySelector('.due-date-input').value = todo.dueDate ? new Date(todo.dueDate).toISOString().substring(0, 10) : null
                document.querySelector('.priority-input').value = todo.priority

                isEdit = true
                selectedTodoId = index
                addTodoDialog.show()
            })

            todoDeleteButton.addEventListener('click', function () {
                todos.remove(index)
                updateTodoList()
            })
        })

    }

    const update = () => {
        updateProjectList()
        updateProjectTitle()
        updateTodoList()
    }

    const setupProjectDialog = () => {

        // "Show the dialog" button opens the dialog modally
        showButton.addEventListener("click", () => {
            isUpdate = false
            addProjectDialog.showModal();
        });

        // "Close" button closes the dialog
        closeButton.addEventListener("click", () => {
            addProjectDialog.close();
        });
    }

    const setupProjectForm = () => {
        const projectSubmitButton = document.querySelector('.project-submit')
        const projectNameInput = document.querySelector('.project-name-input')
        projectSubmitButton.addEventListener('click', function () {
            if (isUpdate) {
                projects.edit(selectedProjectId, { name: projectNameInput.value })
                selectedProjectId = null
            } else {
                projects.add({ name: projectNameInput.value, isDefault: false })
            }
            display.updateProjectList()
            projectNameInput.value = ''
            addProjectDialog.close()
        })
    }

    const setupTodoDialog = () => {

        // "Show the dialog" button opens the dialog modally
        showTodoButton.addEventListener("click", () => {
            isEdit = false
            addTodoDialog.showModal();
        });

        // "Close" button closes the dialog
        closeTodoButton.addEventListener("click", () => {
            addTodoDialog.close();
        });
    }

    const setupTodoForm = () => {
        document.getElementById("addTodoForm").addEventListener("submit", function (e) {
            e.preventDefault();

            var formData = new FormData(e.target);

            // output as an object
            const newTodo = Object.fromEntries(formData);

            newTodo.priority = Number(newTodo.priority)
            newTodo.dueDate = newTodo["due-date"] !== '' ? new Date(newTodo["due-date"]) : ''
            delete newTodo["due-date"]
            newTodo.projectId = selectedProjectId

            if (isEdit) {
                todos.edit(selectedTodoId, newTodo)
            } else {
                todos.add(newTodo)
            }
            display.updateTodoList()
            addTodoDialog.close()
            e.target.reset()
        });
    }

    const setup = () => {
        setupProjectDialog()
        setupProjectForm()
        setupTodoDialog()
        setupTodoForm()
    }

    return {
        updateProjectList,
        updateProjectTitle,
        updateTodoList,
        update,
        setup
    }
})()

projects.add({ name: "Default Project", isDefault: true })

if (projects.length > 0) {
    projects.setSelectedProject(projects.get()[0].name)
}

todos.add({
    "title": "Test Todo",
    "description": "Something to do",
    "priority": 0,
    "dueDate": "2023-11-28T00:00:00.000Z",
    "projectId": 0
})

todos.add({
    "title": "Test Todo",
    "description": "Something to do",
    "priority": 1,
    "dueDate": "2023-11-28T00:00:00.000Z",
    "projectId": 0
})

todos.add({
    "title": "Test Todo",
    "description": "Something to do",
    "priority": 2,
    "dueDate": "2023-11-28T00:00:00.000Z",
    "projectId": 0
})

console.log(todos.get())
selectedProjectId = 0
display.setup()
display.update()

function createProject(name, isDefault = false) {
    return { name, isDefault };
}

// const project = createProject("Default", true)
// console.log(project)

