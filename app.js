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
            rl.prompt();
            return;
        }

        try {
            let jsonData = JSON.parse(data);

            const newId = jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;

            const newTask = { 
                    id: newId,
                    taskName: task,
                    description: null,
                    status: 'to-do',
                    createdAt: null,
                    updatedAt: null
             };

            jsonData.push(newTask);
            const updatedJson = JSON.stringify(jsonData, null, 4)

            fs.writeFile('tasks.json', updatedJson, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file: ', err);
                    return;
                }
                console.log(`Task added successfully (ID: ${newTask.id})`)
                rl.prompt();
            }) 
        }
        catch (parseError) {
            console.error('Error parsing JSON: ', parseError);
            rl.prompt();
        }
    })
}

// update task function
function updateTask(id, updatedTask) {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            rl.prompt();
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const task = jsonData.find(item => item.id === id);

            if (task) {
                task.taskName = updatedTask;
                const updatedJson = JSON.stringify(jsonData, null, 4);

                fs.writeFile('tasks.json', updatedJson, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file: ', err);
                        return;
                    } else {
                        console.log(`Task updated successfully (ID:${id})`);
                    }
                    rl.prompt();
                })
            } else {
                console.log(`Task with id: ${id} not found.`)
            }
            rl.prompt();

        } catch (parseError) {
            console.error('Error parsing JSON: ', parseError);
            rl.prompt();
        }
}
)}

// mark task done function
function markDone(id) {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            rl.prompt();
            return;
        }

        try {

            const jsonData = JSON.parse(data);
            const task = jsonData.find(item => item.id === id);

            if (task) {
                task.status = 'Completed';
                const updatedJson = JSON.stringify(jsonData, null, 4);
                
                fs.writeFile('tasks.json', updatedJson, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file: ', err);
                        return;
                    } else {
                        console.log(`"${task.taskName}" marked completed. (ID:${id})`);
                    }
                    rl.prompt();
                })
            } else {
                console.log(`Task with id: ${id} not found.`)
                rl.prompt();
            };


        } catch (parseError) {
            console.error('Error parsing JSON: ', parseError);
            rl.prompt();
        }
    }
)};

// list all tasks function
function listTasks() {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            rl.prompt();
            return;
        };

        try {
            jsonData = JSON.parse(data);
            if (jsonData.length === 0) {
                console.log('There are currently no tasks. Use "add" to create one.')
            } else {
            for (let i = 0; i < jsonData.length; i++) {
                console.log(`${jsonData[i].taskName} - Status: ${jsonData[i].status} - Id: ${jsonData[i].id}`);
            }}
            rl.prompt()

        } catch (parseError) {
            console.error('Error parsing JSON: ', parseError);
            rl.prompt();
        }
    }
)};

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

    const restUpdate = args.slice(2);
    const taskNameUpdate = restUpdate.join(' ');
    const idArg = Number(args[1]);

    switch (command) {

        case 'add':

            // variables for add function
            const rest = args.slice(1);
            const taskName = rest.join(' ');

            if (rest.length > 0) {
                addTask(taskName);
            } else {
                console.log('No task added. Please provide a task name.');
            }
            break;

        case 'update':

            if (restUpdate.length > 0) {
                updateTask(idArg, taskNameUpdate);
            } else {
                console.log('No task added. Please provide a task name.');
            }
            break;

        case 'list':
            listTasks()
            break;

        case 'mark-done':

            markDone(idArg);
            break;

    default:
        console.log(`Unknown command: ${command}`);
        break;
    }

});
