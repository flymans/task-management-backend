import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTask(taskId: string): Task {
    const task = this.tasks.find(({ id }) => id === taskId);
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus({
    taskId,
    taskStatus,
  }: {
    taskId: string;
    taskStatus: TaskStatus;
  }): Task {
    this.tasks = this.tasks.map((task) =>
      taskId === task.id ? { ...task, status: taskStatus } : task,
    );
    const task = this.getTask(taskId);
    return task;
  }

  removeTask(taskId: string): void {
    this.tasks = this.tasks.filter(({ id }) => taskId !== id);
  }
}
