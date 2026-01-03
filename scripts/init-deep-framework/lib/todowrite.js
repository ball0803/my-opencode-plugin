const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TodoWrite {
  constructor(todoFile) {
    this.todoFile = todoFile || 'AGENTS.md';
    this.todos = [];
  }

  updateTodo(todos) {
    this.todos = todos;
    this.writeTodoFile();
  }

  writeTodoFile() {
    const content = this.todos
      .map(todo => {
        const statusIcon = todo.status === 'completed' ? '✅' 
                         : todo.status === 'in_progress' ? '🚧' 
                         : '⏳';
        return `${statusIcon} ${todo.content} (${todo.priority})`;
      })
      .join('\n');
    
    fs.writeFileSync(this.todoFile, content);
  }
}

module.exports = { TodoWrite };
