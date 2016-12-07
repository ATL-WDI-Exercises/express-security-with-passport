var express = require('express');
var router = express.Router();

var Todo = require('../models/todo');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    req.flash('error', 'Please signup or login.');
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
  // get all the todos and render the index view
  Todo.find({ user: currentUser }).sort('-createdAt')
  .then(function(todos) {
    res.render('todos/index', { todos: todos } );
  })
  .catch(function(err) {
    return next(err);
  });
});

// NEW
router.get('/new', authenticate, function(req, res, next) {
  var todo = {
    title: '',
    completed: false
  };
  res.render('todos/new', { todo: todo } );
});

// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  Todo.findById(req.params.id)
  .then(function(todo) {
    if (!todo) return next(makeError(res, 'Document not found', 404));
    if (!todo.user.equals(currentUser.id)) return next(makeError(res, 'Nacho Todo!', 401));
    res.render('todos/show', { todo: todo });
  })
  .catch(function(err) {
    return next(err);
  });
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
  var todo = new Todo({
    user:      currentUser,
    title:     req.body.title,
    completed: req.body.completed ? true : false
  });
  todo.save()
  .then(function(saved) {
    res.redirect('/todos');
  })
  .catch(function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  Todo.findById(req.params.id)
  .then(function(todo) {
    if (!todo) return next(makeError(res, 'Document not found', 404));
    if (!todo.user.equals(currentUser.id)) return next(makeError(res, 'Nacho Todo!', 401));
    res.render('todos/edit', { todo: todo });
  })
  .catch(function(err) {
    return next(err);
  });
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  Todo.findById(req.params.id)
  .then(function(todo) {
    if (!todo) return next(makeError(res, 'Document not found', 404));
    if (!todo.user.equals(currentUser.id)) return next(makeError(res, 'Nacho Todo!', 401));
    todo.title = req.body.title;
    todo.completed = req.body.completed ? true : false;
    return todo.save();
  })
  .then(function(saved) {
    res.redirect('/todos');
  })
  .catch(function(err) {
    return next(err);
  });
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  Todo.findById(req.params.id)
  .then(function(todo) {
    if (!todo.user.equals(currentUser.id)) return next(makeError(res, 'Nacho Todo!', 401));
    return todo.remove();
  })
  .then(function() {
    res.redirect('/todos');
  })
  .catch(function(err) {
    return next(err);
  });
});

// TOGGLE completed
router.get('/:id/toggle', authenticate, function(req, res, next) {
  Todo.findById(req.params.id)
  .then(function(todo) {
    if (!todo) return next(makeError(res, 'Document not found', 404));
    if (!todo.user.equals(currentUser.id)) return next(makeError(res, 'Nacho Todo!', 401));
    todo.completed = !todo.completed;
    return todo.save();
  })
  .then(function(saved) {
    res.redirect('/todos');
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
