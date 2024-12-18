const readline = require('readline');
const fs = require ('fs');

// create input interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'task-cli '
});

// open interface
rl.prompt();

// add task function
function addTask(task) {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err)
            return;
        }

        try {
            let jsonData = JSON.parse(data);

            newId = jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;

            const newTask = { 
                id: newId,
                task: {
                    taskName: task,
                    description: null,
                    status: null,
                    createdAt: null,
                    updatedAt: null
                }
             }

            jsonData.push(newTask);
            const updatedJson = JSON.stringify(jsonData, null, 4)

            fs.writeFile('tasks.json', updatedJson, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file: ', err);
                    return;
                }
                console.log(`Task added successfully (ID: ${newTask.id})`)
            })
        }
        catch (parseError) {
            console.error('Error parsing JSON: ', parseError);
        }
    })
}

// update task function
function updateTask(id, updatedTask) {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err)
            return;
        }

        try {
            let jsonData = JSON.parse(data);
            const task = jsonData.find(task => task.id === id);

            if (task) {
                task.task.taskName = updatedTask;
                const updatedJson = JSON.stringify(jsonData, null, 4);

                fs.writeFile('tasks.json', updatedJson, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file: ', err);
                        return;
                    } else {
                        console.log(`Task updated successfully (ID:${id})`);
                    }
                })
            } else {
                console.log(`Task with id: ${id} not found.`)
            }

        } catch (parseError) {
            console.error('Error parsing JSON: ', parseError);
        }
}
)}

// allows for "" and '' strings as inputs
function parseInput(input) {
    const regex = /(?:[^\s"]+|"[^"]*"|'[^']*')+/g;
    const matches =  input.match(regex) || [];
    return matches.map(arg => arg.replace(/^['"]|['"]$/g, ''));
};

// handle user commands
rl.on('line', (line) => {
    const input = line.trim();
    const args = parseInput(input);
    const command = args[0];

    switch (command) {

        case 'add':

        // variables for add function
        const rest = args.slice(1);
        const taskName = rest.join(' ');

        if (rest.length > 0) {
            addTask('tasks.json', taskName);
        } else {
            console.log('No task added. Please provide a task name.');
        }
        break;

        case 'update':

        // variables for update function
        const restUpdate = args.slice(2);
        const taskNameUpdate = restUpdate.join(' ');
        const idArg = Number(args[1]);

        if (restUpdate.length > 0) {
            updateTask(idArg, taskNameUpdate);
        } else {
            console.log('No task added. Please provide a task name.');
        }
        break;

    default:
        console.log(`Unknown command: ${command}`);
        break;
    }

    rl.prompt()
});