const request = require('./request');
const fs = require('fs');

const {
  courses,
  events,
  races,
  contacts
} = JSON.parse(fs.readFileSync('data.json'));

(async () =>
{
  const courseIds = {};
  for (let course of Object.values(courses))
  {
    course.distance = parseFloat(course.distance);
    course.handicap = {
      factor: parseFloat(course.handicapFactor),
      cutoff: parseFloat(course.handicapCutoff)
    };
    delete course.handicapFactor
    delete course.handicapDetails
    delete course.handicapCutoff
    delete course.keepRecords
    course.minAge31Dec = parseFloat(course.minAge31Dec)
    course.legs = parseFloat(course.legs); if (!course.legs) delete course.legs;

    let result = await request.create(`http://localhost:8080/api/v0/courses/new.json`, course)
    courseIds[course.id] = result.id;
  }

  const eventIds = {};
  for (let event of Object.values(events))
  {
    event.date = event.date.split('/').reverse().join('-');
    let result = await request.create(`http://localhost:8080/api/v0/events/new.json`, event)
    eventIds[event.id] = result.id;
  }

  const contactIds = {};
  for (let contact of Object.values(contacts))
  {
    let result = await request.create(`http://localhost:8080/api/v0/contacts/new.json`, contact)
    contactIds[contact.id] = result.id;
  }
  const raceIds = {};
  for (let race of Object.values(races))
  {
    race.open = race.open === 'Yes';
    race.alternate = race.alternate === 'Yes';
    race.junior = race.junior === 'Yes';
    race.pointscore = race.pointscore === 'Yes';
    race.eventId = eventIds[race.eventId];
    race.courseId = eventIds[race.course];
    delete race.course;
    if (race.placeContacts)
    {
      race.placeContacts = race.placeContacts.map(c => contactIds[c]);
    }
    await request.create(`http://localhost:8080/api/v0/races/new.json`, race)
  }
})()


process.on('unhandledRejection', function (reason, p)
{
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});
