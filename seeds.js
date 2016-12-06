var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt   = require('bcrypt-nodejs');
var Todo = require('./models/todo');
var User = require('./models/user');

mongoose.connect('mongodb://localhost/todos');

// our script will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.error('ERROR:', err);
  quit();
  return err;
}


// create some User objects
function getUsers() {
  let batman = new User({
    local: {
      email: 'batman@batcave.com',
      password: bcrypt.hashSync('robin',  bcrypt.genSaltSync(8))
    }
  });
  let charlie = new User({
    local: {
      email: 'charlie@peanuts.com',
      password: bcrypt.hashSync('snoopy', bcrypt.genSaltSync(8))
    }
  });
  return [batman, charlie];
}

console.log('removing old todos...');
Todo.remove({})
.then(function() {
  console.log('removing old users...');
  return User.remove({});
})
.then(function() {
  return User.create(getUsers());
})
.then(function(users) {
  console.log('Saved users:', users);
  console.log('creating some new todos...');

  var cleanBatcave   = new Todo({ user: users[0], title: 'Clean the Batcave',  completed: false });
  var washBatmobile  = new Todo({ user: users[0], title: 'Wash the Batmobile', completed: true  });

  var kickFootball   = new Todo({ user: users[1], title: 'Kick the Football',  completed: false });
  var giveSnoopyBath = new Todo({ user: users[1], title: 'Give Snoopy a Bath', completed: true  });

  return Todo.create([cleanBatcave, washBatmobile, kickFootball, giveSnoopyBath]);
})
.then(function(savedTodos) {
  console.log('Just saved', savedTodos.length, 'todos.');
  return Todo.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos:');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  return Todo.findOne({title: 'Clean the Batcave'});
})
.then(function(cleanBatcave) {
  cleanBatcave.completed = true;
  return cleanBatcave.save();
})
// .then(function(cleanBatcave) {
//   console.log('updated cleanBatcave:', cleanBatcave);
//   return cleanBatcave.remove();
// })
.then(function(deleted) {
  return Todo.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos:');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  quit();
})
.catch(handleError);
