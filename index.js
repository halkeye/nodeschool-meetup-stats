const pify = require('pify');
const fs = require('fs');
const meetup = pify(require('meetup-api')({
  key: process.env.MEETUP_API_KEY
}));

async function main () {
  const events = await meetup.getEvents({
    status: 'past',
    has_ended: true,
    group_urlname: 'nodeschool-vancouver'
  });
  const eventDataSummary = [];

  for (const eventDetails of events.results) {
    const eventAttendance = await meetup.getEventAttendance({
      'urlname': 'nodeschool-vancouver',
      'id': eventDetails.id
    });
    const members = eventAttendance.filter(m => m.rsvp.response);
    const attendies = members.map(m => {
      return {
        id: m.member.id,
        name: m.member.name.trim(),
        response: m.rsvp.response,
        status: m.status
      };
    });
    const d = attendies.reduce((acc, cur) => {
      acc.statuses[cur.status] = (acc.statuses[cur.status] || 0) + 1;
      acc.responses[cur.response] = (acc.responses[cur.response] || 0) + 1;
      return acc;
    }, {
      id: eventDetails.id,
      name: eventDetails.name.replace(/[^\x20-\x7E]+/g, '').trim(),
      time: eventDetails.time,
      statuses: {},
      responses: {}
    });
    eventDataSummary.push(d);
  }

  fs.writeFileSync('public/data.json', JSON.stringify(eventDataSummary));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});



