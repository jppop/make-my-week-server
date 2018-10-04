/* eslint-disable */
import casual from 'casual';
import moment from 'moment';
import { logger } from './config/logger';

casual.seed(123);

const projects = [];
const tasks = [];
const works = [];
const users = [];

casual.define('project', () => ({
  id: casual.uuid,
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

casual.define('task', project => {
  const duration = round(casual.double(0, 8 * 5 * 4 * 6));
  const planned = round(duration * casual.random);
  return {
    id: casual.uuid,
    name: casual.word,
    label: casual.sentence,
    color: casual.color_name,
    projectId: project.id,
    planned: duration,
    completed: planned,
  };
});
casual.define('user', () => {
  const firstName = casual.first_name;
  const lastName = casual.last_name;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${casual.domain}`;
  return {
    id: casual.uuid,
    username: email,
    fullName: `${firstName} ${lastName}`,
    email: email,
  };
});

const someDay = new Date('2018-06-04T00:00:00');

casual.define('startAndTime', firstDay => {
  const start = new Date(firstDay);
  const dayIndex = casual.integer(0, 5);
  start.setDate(firstDay.getDate() + dayIndex);
  const startTime = round(casual.double(8, 17.45));
  const startTimeHm = hoursAndMinutes(startTime);
  start.setHours(startTimeHm.hours, startTimeHm.minutes);
  const end = new Date(start);
  const endTime = Math.min(startTime + round(casual.double(1, 8)), 18);
  const endTimeHm = hoursAndMinutes(endTime);
  end.setHours(endTimeHm.hours, endTimeHm.minutes);
  return {
    start,
    end,
  };
});

const createWork = (project, task, owner, start, end, lunchTime) => ({
  id: casual.uuid,
  projectId: project.id,
  taskId: task.id,
  label: `${project.name} - ${task.label}`,
  start: start,
  end: end,
  lunchTime: lunchTime || undefined,
  ownerId: owner.id,
});
casual.define('work', (project, task, owner) => {
  const firstDay = moment(someDay)
    .add(7 * casual.integer(-10, 10), 'days')
    .toDate();
  const { start, end } = casual.startAndTime(firstDay);
  logger.silly('start: %s, end: %s', start, end);
  const work = createWork(project, task, owner, start, end, true);
  return work;
});

// create some users
for (let usrIndex = 0; usrIndex < 20; usrIndex++) {
  const user = casual.user;
  users.push(user);
}

// create works
for (let prjIndex = 0; prjIndex < 5; prjIndex++) {
  const project = casual.project;
  logger.silly('project: %j', project);
  const nbTasks = casual.integer(3, 10);
  for (let taskIndex = 0; taskIndex < nbTasks; taskIndex++) {
    const task = casual.task(project);
    logger.silly('task: %j', task);
    const nbWorks = casual.integer(0, 10);
    for (let workIndex = 0; workIndex < nbWorks; workIndex++) {
      const user = users[casual.integer(0, users.length - 1)];
      const work = casual.work(project, task, user);
      logger.silly('work: %j', work);
      works.push(work);
    }
    tasks.push(task);
  }
  projects.push(project);
}

export const data = {
  projects,
  tasks,
  works,
  users,
};
