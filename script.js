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

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog .close");
const projectNameInputEl = document.querySelector('.project-name-input')
let isUpdate = false
let selectedProjectId = null

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
    isUpdate = false
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
    console.log("here")
  dialog.close();
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
                dialog.showModal()
            })

            deleteProjectButton.addEventListener('click', function() {
                projects.remove(index)
                updateProjectList()
            })
        })
    }

    const updateProjectTitle = () => {
        const projectTitleElement = document.querySelector('.project-title')
        projectTitleElement.textContent = projects.getSelectedProject()
    }

    return {
        updateProjectList,
        updateProjectTitle
    }
})()

projects.add({name: "Project 1"})
projects.add({name: "Project 2"})
projects.add({name: "Project 3"})

display.updateProjectList()

const projectListItems = document.querySelectorAll(".project-list li")
projectListItems.forEach((projectListItem) => {
    projectListItem.addEventListener('click', function() {
        projectListItems.forEach((p) => p.classList.remove('selected'))
        this.classList.add('selected')
        console.log(this)
        projects.setSelectedProject(this.querySelector('span').textContent)
        display.updateProjectTitle()
    })
})

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
    dialog.close()
})

console.log(projects.getSelectedProject())
