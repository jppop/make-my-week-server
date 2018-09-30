/* eslint-disable */
import casual from 'casual';
import { logger } from './config/logger';

casual.seed(123);
let seq = 0;

const projects = [];
const tasks = [];
const works = [];

export const createProject = () => {
  return casual.project;
};
export const createWork = (project, task, start, end, lunchTime) => ({
  id: (++seq).toString(),
  projectId: project.id,
  taskId: task.id,
  start: start,
  end: end,
  lunchTime: lunchTime || undefined,
});

casual.define('project', () => ({
  id: (++seq).toString(),
  name: casual.word,
  label: casual.sentence,
}));

const round = n => (Math.ceil((n * 100) / 25.0) * 25) / 100;
const hoursAndMinutes = time => {
  const hours = Math.trunc(time);
  const minutes = (time - hours) * 60;
  return {
    hours: hours,
    minutes: minutes,
  };
};

casual.define('task', projectId => {
  const duration = round(casual.double(0, 8 * 5 * 4 * 6));
  const planned = round(duration * casual.random);
  return {
    id: (++seq).toString(),
    name: casual.word,
    label: casual.sentence,
    color: casual.color_name,
    projectId,
    planned: duration,
    completed: planned,
  };
});

for (let prjIndex = 0; prjIndex < 5; prjIndex++) {
  const project = casual.project;
  // logger.debug(JSON.stringify(project));
  const nbTasks = casual.integer(3, 10);
  for (let taskIndex = 0; taskIndex < nbTasks; taskIndex++) {
    const task = casual.task(project.id);
    // logger.debug(JSON.stringify(task));
    const nbWorks = casual.integer(0, 10);
    const firstDay = new Date('2018-09-24T00:00:00');
    for (let workIndex = 0; workIndex < nbWorks; workIndex++) {
      const start = new Date(firstDay);
      const dayIndex = casual.integer(0, 5);
      start.setDate(firstDay.getDate() + dayIndex);
      const startTime = round(casual.double(8, 17.45));
      const startTimeHm = hoursAndMinutes(startTime);
      start.setHours(startTime.hours, startTime.minutes);
      const end = new Date(start);
      const endTime = Math.min(startTime + round(casual.double(1, 8)), 18);
      const endTimeHm = hoursAndMinutes(endTime);
      end.setHours(endTimeHm.hours, endTimeHm.minutes);
      const work = createWork(project, task, start, end);
      works.push(work);
    }
    tasks.push(task);
  }
  projects.push(project);
}

export const data = {
  projects: projects,
  tasks: tasks,
  works: works,
};
