import { Task } from './Task';

export class Footer {
  tasks: Task[];
  constructor() {
    this.tasks = [];
  }
  load(tasks: [number, number, (now: number, max: number) => number][]) {
    this.tasks = [];
    for (let [now, max, check] of tasks) {
      this.tasks.push(new Task(now, max, check));
    }
  }
  get all_ok(): boolean {
    return this.tasks.length === 0 ? true : this.tasks.map((task) => task.ok()).reduce((x, y) => (x && y));
  }
}