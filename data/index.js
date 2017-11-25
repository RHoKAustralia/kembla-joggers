"use strict";

const fs = require('fs');
const load = require('./load');
const request = require('./request');

const locations = {};
for (let location of load('./xlsx/Locations.xlsx'))
{
  locations[location.location] = location;
}

const courses = {};
const events = {};
const races = {};
const contacts = {};

for (let course of load('./xlsx/Courses.xlsx'))
{
  course.location = locations[course.location]
  course.id = course.courseId;
  delete course.courseId;
  courses[course.id] = course
}

for (let race of load('./xlsx/Events.xlsx'))
{
  const eventName = race.series + ' ' + race.date.split('/').reverse().join('-')
  events[eventName] = events[eventName] || {
    id: Object.keys(events).length + '',
    series: race.series,
    date: race.date
  }

  race.eventId = events[eventName].id;
  race.id = race.line;
  race.course = Object.keys(courses).filter(course => {
    //console.log(courses[course].courseName, race.courseName)
    return courses[course] && courses[course].location && courses[course].location.location === race.location && courses[course].courseName === race.courseName
  })[0];

  delete race.series
  delete race.date
  delete race.line
  delete race.location
  delete race.courseName

  races[race.id] = race
}


let notFound = 0;

for (let result of load('./xlsx/Results.xlsx'))
{
  delete result.line;
  const event = Object.values(events).filter(event => event.series === result.series && event.date === result.date)[0];
  delete result.series
  delete result.date
  const course = Object.values(courses).filter(course => course.location && course.location.location === result.location && course.courseName === result.courseName)[0];
  delete result.courseName
  delete result.location
  const race = Object.values(races).filter(race => event && race.eventId === event.id && course && course.id == race.course)[0];
  delete result.eventId
  delete result.course
  let contact = Object.values(contacts).filter(contact => contact.firstName === result.firstName && contact.lastName === result.lastName)[0];
  if (!contact)
  {
    contact = {
      id: Object.keys(contacts).length + '',
      firstName: result.firstName,
      lastName: result.lastName,
      memberId: result.id
    }
    contacts[contact.id] = contact
  }
  delete result.firstName
  delete result.lastName
  delete result.fullName
  delete result.id
  if (race && contact)
  {
    race.placeTimes = race.placeTimes || [];
    race.placeTimes[result.place - 1] = result.time
    race.placeContacts = race.placeContacts || [];
    race.placeContacts[result.place - 1] = contact.id
  }
  else
  {
    notFound++;
    //console.log('race not found');
  }
}

console.log(notFound, 'records not found');

fs.writeFileSync('data.json', JSON.stringify({
  courses,
  events,
  races,
  contacts
}))
