// const todos = (function() {
//     let list = []
//     const add = (todo) => list.push(todo)
//     const remove = (todoToDelete) => list = list.filter((todo) => todoToDelete === todo )
//     const get = () => list
//     const set = (value) => list = value 
//     const show = () => {
//         const container = document.querySelector(".todos")
//         list.forEach((todo) => {
//             const card = null
//         })
//     }
//     return {
//         add,
//         remove,
//         get
//     }
// })()

// const board = (function() {
//     const setTitle = () => {
//         return document.createElement('h1')
//     }
//     const createCard = (title, description = "") => {
//         const card = document.createElement('div')
//         const cardContent = document.querySelector(".sample-card").innerHTML
//         console.log(document.querySelector(".sample-card").querySelector(".card-title"))
//         card.classList.add('card')
//         card.innerHTML = cardContent
//         return card

//     }
//     const show = (todos) => {
//         const container = document.querySelector(".todos")
//         todos.forEach((todo) => {
//             console.log(todo)
//             const card = createCard("Test", "Test")
//             container.appendChild(card)
//         })
//     }
//     return {
//         show
//     }
// })()




// function todo(title, description) {
//     console.log(todos.get().length)
//     const id = Date.now() // generate id
//     return {
//         id,
//         title,
//         description
//     }
// }

// const todo1 = todo("Todo 1", "Description")
// const todo2 = todo("Todo 2", "Description 2")

// todos.add(todo1)
// todos.add(todo2)
// // todos.remove(todo2)

// // board.show(todos.get())

const addProjectDialog = document.querySelector("#add-project-dialog");
const showButton = document.querySelector(".add-project");
const closeButton = document.querySelector("#add-project-dialog .close");
const projectNameInputEl = document.querySelector('.project-name-input')
let isUpdate = false
let selectedProjectId = null

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
    isUpdate = false
    addProjectDialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
    console.log("here")
    addProjectDialog.close();
});


const addTodoDialog = document.querySelector("#add-todo-dialog");
const showTodoButton = document.querySelector(".add-todo");
const closeTodoButton = document.querySelector("#add-todo-dialog .close");
const todoTitleInput = document.querySelector('.todo-title-input')

// "Show the dialog" button opens the dialog modally
showTodoButton.addEventListener("click", () => {
    isUpdate = false
    addTodoDialog.showModal();
});

// "Close" button closes the dialog
closeTodoButton.addEventListener("click", () => {
    console.log("here")
    addTodoDialog.close();
});


const projects = (function(){
    let list = [];
    let selectedProject = null;
    const add = (project) => {
        list.push(project)
    }
    const edit = (id, project) => {
        list[id] = project
    }
    const get = () =>{
        return list
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

const todos = (function() {
    let todos = []
    const add = (todo) => {
        todos.push(todo)
    }
    const get = () => todos
    return {
        add,
        get
    }
})()

const display = (function() {
    const updateProjectList = () => {
        const projectList = projects.get()
        const projectListElement = document.querySelector(".project-list")
        projectListElement.textContent = ''
        projectList.forEach((project, index) =>{
            const projectListItem = document.createElement("li")
            const projectNameSpan = document.createElement('span')
            projectNameSpan.textContent = project.name
            projectListItem.appendChild(projectNameSpan)
            projectListItem.classList.add('project')

            const editProjectButton = document.createElement('button')
            editProjectButton.textContent = 'Edit'
            editProjectButton.classList.add('edit-project')
            // editProjectButton.setAttribute('data-id', index)

            const deleteProjectButton = document.createElement('button')
            deleteProjectButton.textContent = 'Delete'
            deleteProjectButton.classList.add('delete-project')
            // deleteProjectButton.setAttribute('data-id', index)

            projectListItem.appendChild(editProjectButton)
            projectListItem.appendChild(deleteProjectButton)
            projectListElement.appendChild(projectListItem)

            editProjectButton.addEventListener('click', function() {
                projectNameInput.value = project.name
                isUpdate = true
                selectedProjectId = index
                addProjectDialog.showModal()
            })

            deleteProjectButton.addEventListener('click', function() {
                projects.remove(index)
                updateProjectList()
            })
        })

        const projectListItems = document.querySelectorAll(".project-list li")
        projectListItems.forEach((projectListItem, index) => {
            projectListItem.addEventListener('click', function() {
                projectListItems.forEach((p) => p.classList.remove('selected'))
                this.classList.add('selected')
                console.log(this.classList)
                selectedProjectId = index
                projects.setSelectedProject(this.querySelector('span').textContent)
                display.update()
            })
        })
    }

    const updateProjectTitle = () => {
        const projectTitleElement = document.querySelector('.project-title')
        // projectTitleElement.textContent = projects.getSelectedProject()
        projectTitleElement.textContent = projects.get()[selectedProjectId].name
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
        projectTodos.forEach((todo) =>{
            const todoListItem = document.createElement('li')
            const todoItem = document.createElement('div')
            const todoTitle = document.createElement('h3')
            todoTitle.textContent = todo.title
            const todoContent = document.createElement('div')
            todoContent.classList.add('todo-content')
            const todoDescription = document.createElement('p')
            todoDescription.classList.add('todo-description')
            todoDescription.textContent = todo.description
            const todoDueDate = document.createElement('p')
            const dueDate = new Date(todo.dueDate)
            todoDueDate.textContent = `${dueDate.getDate()}/${dueDate.getMonth()}/${dueDate.getFullYear()}`
            const todoPriority = document.createElement('p')
            todoPriority.textContent = Priority[todo.priority]
            const todoProject = document.createElement('p')
            todoProject.textContent = projects.get()[selectedProjectId].name
            todoContent.append(todoDescription, todoDueDate, todoPriority, todoProject)
            todoItem.appendChild(todoTitle)
            todoItem.appendChild(todoContent)
            todoListItem.appendChild(todoItem)
            todoList.appendChild(todoListItem)
        })
        
    }

    const update = () => {
        updateProjectList()
        updateProjectTitle()
        updateTodoList()
    }

    return {
        updateProjectList,
        updateProjectTitle,
        updateTodoList,
        update
    }
})()

projects.add({name: "Project 1"})
projects.add({name: "Project 2"})
projects.add({name: "Project 3"})

todos.add({
    title: "Test Todo",
    description: "Just for testing",
    dueDate: new Date(),
    priority: 1,
    projectId: 0
})

projects.setSelectedProject(projects.get()[0].name)
selectedProjectId = 0
// display.updateProjectList()
display.update()



const projectSubmitButton = document.querySelector('.project-submit')
const projectNameInput = document.querySelector('.project-name-input')
projectSubmitButton.addEventListener('click', function() {
    if(isUpdate) {
        projects.edit(selectedProjectId, {name: projectNameInput.value})
        selectedProjectId = null
    } else {
        projects.add({name: projectNameInput.value})
    }
    display.updateProjectList()
    projectNameInput.value = ''
    addProjectDialog.close()
})

document.getElementById("addTodoForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    var formData = new FormData(e.target);

    // output as an object
    const newTodo = Object.fromEntries(formData);

    newTodo.priority = Number(newTodo.priority)
    newTodo.dueDate = new Date(newTodo["due-date"])
    delete newTodo["due-date"]
    newTodo.projectId = selectedProjectId

    todos.add(newTodo)
    console.log(todos.get())
    display.updateTodoList()
    addTodoDialog.close()
    e.target.reset()
  });

console.log(projects.getSelectedProject())

