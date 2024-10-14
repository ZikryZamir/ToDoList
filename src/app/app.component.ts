import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { signal, computed } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from './interfaces/todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, FormsModule, NgClass, NgIf],
  styleUrl: 'app.component.scss',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  count = signal<number>(0);
  todos = signal<Todo[]>([]);
  newTodotext = signal<string>('');

  total = computed(() => this.todos().length)

  constructor() {
    effect(() => {
      const items = this.todos().length;
      console.log(this.todos());
      //can also use to call apis
    })
  }

  ngOnInit() {
    
  }

  handleInput(event: Event) {
    const input = event?.target as HTMLInputElement;
    this.newTodotext.set(input?.value);
  }

  addTodo() {
    if(this.newTodotext().trim().length) {
      const newTodo: Todo = {
        id: Date.now(),
        text: this.newTodotext(),
        done: false,
        isEditing: false
      };
      this.todos.set([...this.todos(), newTodo]);
      this.newTodotext.set('');
    } else {
      console.error('Text is empty.');
    }
  }

  deleteTodo(id: number) {
    const updatedTodos = this.todos().filter((todo) => todo.id !== id);
    this.todos.set(updatedTodos);
  }

  toggleCompleted(todo: Todo): void {
    todo.done = !todo.done;
    const updatedTodos = this.todos().map(t => t.id === todo.id ? todo : t);
    this.todos.set(updatedTodos);
  }

  toggleEdit(id: number): void {
    const todoList = this.todos();
    const todo = todoList.find(todo => todo.id === id);
    if (todo) {
      todo.isEditing = !todo.isEditing;  // Toggle the edit mode
      this.todos.set([...todoList]);
    }
  }

  saveEdit(todo: Todo, updatedText: string) {
    todo.text = updatedText;
    todo.isEditing = false;  // Disable edit mode after saving
    this.todos.set([...this.todos()]);
  }
}
