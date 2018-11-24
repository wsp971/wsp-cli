// console.trace(xxxxxxxx);
// process.stdout.write('xxxxxx');

var os = require('os');

var opn = require('opn');



//执行路径
console.log(process.execPath);

console.log(__filename);

console.log(__dirname);

//当前工作进程的工作目录
console.log(process.cwd())
console.log(os.homedir());
console.log(os.tmpdir());


 // 打开浏览器
// opn('http://github.com',{app:'google chrome'});


// process.argv.forEach(function(val,index,array){
//     console.log(index + ": " + val);
// })

//inquirer
var inquirer = require('inquirer');

var questions = [

    {
        type: 'input',
        name:'name',
        message:'whats your name?'
    },

    {
        type:'input',
        name:"lastname",
        message:'whats you last name?'
    },

    {
        type:'password',
        name:"password",
        message:'enter you password?'
    },
    {
        type:'confirm',
        name:"isman",
        message:"你是男人嘛？",
        default: true
    },
    {
        type: 'editor',
        name: 'bio',
        message: 'Please write a short bio of at least 3 lines.',
        validate: function(text) {
            if (text.split('\n').length < 3) {
                return 'Must be at least 3 lines.';
            }

            return true;
        }
    }
    // {
    //     type: 'list',
    //     name: 'theme',
    //     message: 'What do you want to do?',
    //     choices: [
    //         'Order a pizza',
    //         'Make a reservation',
    //         new inquirer.Separator(),
    //         'Ask for opening hours',
    //         {
    //             name: 'Contact support',
    //             disabled: 'Unavailable at this time'
    //         },
    //         'Talk to the receptionist'
    //     ]
    // },
    // {
    //     type: 'list',
    //     name: 'size',
    //     message: 'What size do you need?',
    //     choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    //     filter: function(val) {
    //         return val.toLowerCase();
    //     }
    // },
    // {
    //     type: 'rawlist',
    //     name: 'size',
    //     message: 'What size do you need',
    //     choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    //     filter: function(val) {
    //         return val.toLowerCase();
    //     }
    // },
    // {
    //     type: 'expand',
    //     message: 'Conflict on `file.js`: ',
    //     name: 'overwrite',
    //     choices: [
    //         {
    //             key: 'y',
    //             name: 'Overwrite',
    //             value: 'overwrite'
    //         },
    //         {
    //             key: 'a',
    //             name: 'Overwrite this one and all next',
    //             value: 'overwrite_all'
    //         },
    //         {
    //             key: 'd',
    //             name: 'Show diff',
    //             value: 'diff'
    //         },
    //         new inquirer.Separator(),
    //         {
    //             key: 'x',
    //             name: 'Abort',
    //             value: 'abort'
    //         }
    //     ]
    // },
    // {
    //     type: 'checkbox',
    //     message: 'Select toppings',
    //     name: 'toppings',
    //     choices: [
    //         new inquirer.Separator(' = The Meats = '),
    //         {
    //             name: 'Pepperoni'
    //         },
    //         {
    //             name: 'Ham'
    //         },
    //         {
    //             name: 'Ground Meat'
    //         },
    //         {
    //             name: 'Bacon'
    //         },
    //         new inquirer.Separator(' = The Cheeses = '),
    //         {
    //             name: 'Mozzarella',
    //             checked: true
    //         },
    //         {
    //             name: 'Cheddar'
    //         },
    //         {
    //             name: 'Parmesan'
    //         },
    //         new inquirer.Separator(' = The usual ='),
    //         {
    //             name: 'Mushroom'
    //         },
    //         {
    //             name: 'Tomato'
    //         },
    //         new inquirer.Separator(' = The extras = '),
    //         {
    //             name: 'Pineapple'
    //         },
    //         {
    //             name: 'Olives',
    //             disabled: 'out of stock'
    //         },
    //         {
    //             name: 'Extra cheese'
    //         }
    //     ],
    //     validate: function(answer) {
    //         if (answer.length < 1) {
    //             return 'You must choose at least one topping.';
    //         }
    //         return true;
    //     }
    // }

];

var ui = new inquirer.ui.BottomBar();


// pipe a Stream to the log zone
// process.stdout.pipe(ui.log);

// Or simply write output
ui.log.write('something just happened.');
ui.log.write('Almost over, standby!');

// During processing, update the bottom bar content to display a loader
// or output a progress bar, etc
ui.updateBottomBar('new bottom bar content');


inquirer.prompt(questions)
    .then(answer =>{
        console.log(answer);
    })
