let driver = [];

const filters = {
    searchText: '',
    hideCompleted: false
}

// this is for filtering the todo
$('.search-todo').on('input', () =>{
    filters.searchText = $('.search-todo').val();
    createList(driver, filters);
})

// this is for rendering the todo
const renderDriver = function(){
    db.collection('driver').get().then(data =>{
        data.docs.forEach(element =>{
            const singleTodo = element.data();
            driver.push(singleTodo);
        });
        createList(driver, filters);
    });
}

// this is for displaying driver in the browser
const createList = function (driver, filters) {
    let count = 0;
    const filteredDriver = $.grep(driver, element => {
        return element.name.toLowerCase().includes(filters.searchText.toLowerCase());
    })
    $('.driver').empty();
    filteredDriver.forEach(element =>{
        let divElement = $('<div class="form card singleTodo">');
        let buttonElement = $('<button class="btn btn-danger float-right">');
        let labelElement = $('<label class="form-check-label">');
        let checkboxElement = $();
        let cardBodyElement = $('<div class="card-body">');

        buttonElement.text('X');
        buttonElement.on('click', ()=>{
            deleteTodo(element);
        })
        checkboxElement.attr('checked', element.isCompleted);
        checkboxElement.on('change', ()=>{
            toggleTodo(element);
        })
        labelElement.append(checkboxElement);
        labelElement.append('<span>'+element.name+'</span>');
        cardBodyElement.append(labelElement);
        cardBodyElement.append(buttonElement);
        divElement.append(cardBodyElement);
        $('.driver').append(divElement);
        if(element.isCompleted == false){
            count++;
        }
    })
    $('.status').text('You have '+count+' driver left');
}

// this is for updating todo
const toggleTodo = function (element) {
    const new_todo = {
        id: element.id,
        isCompleted: !element.isCompleted,
        name: element.name
    }
    db.collection('driver').doc(element.id).update(new_todo).then(()=>{
        console.log('Updated successfully.');
        element.isCompleted = !element.isCompleted;
        createList(driver, filters);
    }).catch(error=>{
        console.log('Error occured', error);
    })
}

// this is for deleting a todo
const deleteTodo = function (element) {
    db.collection('driver').doc(element.id).delete().then(()=>{
        console.log('Todo deleted successfully.');
        const todoIndex = driver.findIndex(todo => todo.id === element.id);
        if(todoIndex != -1){
            driver.splice(todoIndex, 1);
            createList(driver, filters);
        }
    });
};

// this is for adding a todo
$('.submit-todo').click((event) => {
    event.preventDefault();
    const id = uuidv4();
    const todo = {
        name: $('.new-todo').val(),
        id: id
    }
    db.collection('driver').doc(id).set(todo).then(()=>{
        console.log('Todo added successfully!');
        $('.new-todo').val('');
        driver.push(todo);
        createList(driver, filters);
    }).catch(error=>{
        console.log('Error occured', e);
    })
})


const hideCompleted = function (driver, filters) {
    const filteredDriver = $.grep(driver, (element) => {
        if(element.isCompleted == filters.hideCompleted){
            return element;
        }
    })
    createList(filteredDriver, filters);
}

renderDriver();