/*
DESCRIPTION:
The businesspeople among you will know that it's often not easy to find an appointment. In this kata we want to find such an appointment automatically. You will be given the calendars of our businessperson and a duration for the meeting. Your task is to find the earliest time, when every businessperson is free for at least that duration.

Example Schedule:
Person | Meetings
-------+-----------------------------------------------------------
     A | 09:00 - 11:30, 13:30 - 16:00, 16:00 - 17:30, 17:45 - 19:00
     B | 09:15 - 12:00, 14:00 - 16:30, 17:00 - 17:30
     C | 11:30 - 12:15, 15:00 - 16:30, 17:45 - 19:00

Rules:

All times in the calendars will be given in 24h format "hh:mm", the result must also be in that format
A meeting is represented by its start time (inclusively) and end time (exclusively) -> if a meeting takes place from 09:00 - 11:00, the next possible start time would be 11:00
The businesspeople work from 09:00 (inclusively) - 19:00 (exclusively), the appointment must start and end within that range
If the meeting does not fit into the schedules, return null or None as result
The duration of the meeting will be provided as an integer in minutes
Following these rules and looking at the example above the earliest time for a 60 minutes meeting would be 12:15.

Data Format:

The schedule will be provided as 3-dimensional array. The schedule above would be encoded this way:

[
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
]

     */ 
// get started time function

/*
===================================================
     CHAT GPT SOLUTION
===================================================
*/ 

function findEarliestMeeting(schedule, duration) {
    const WORK_START = "09:00";
    const WORK_END = "19:00";

    // Helper: Convert time string to minutes since midnight
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    // Helper: Convert minutes since midnight to time string
    const minutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
        const mins = (minutes % 60).toString().padStart(2, '0');
        return `${hours}:${mins}`;
    };

    const workStart = timeToMinutes(WORK_START);
    const workEnd = timeToMinutes(WORK_END);

    // Step 1: Collect and merge all busy times across schedules
    let allMeetings = [];
    for (const person of schedule) {
        for (const [start, end] of person) {
            allMeetings.push([timeToMinutes(start), timeToMinutes(end)]);
        }
    }

    // Sort all meetings by start time
    allMeetings.sort((a, b) => a[0] - b[0]);

    // Merge overlapping or contiguous intervals
    const mergedMeetings = [];
    for (const [start, end] of allMeetings) {
        if (!mergedMeetings.length || mergedMeetings[mergedMeetings.length - 1][1] < start) {
            mergedMeetings.push([start, end]);
        } else {
            mergedMeetings[mergedMeetings.length - 1][1] = Math.max(mergedMeetings[mergedMeetings.length - 1][1], end);
        }
    }

    // Step 2: Find free slots between merged intervals
    let prevEnd = workStart;
    for (const [start, end] of mergedMeetings) {
        if (start - prevEnd >= duration) {
            return minutesToTime(prevEnd); // Return the earliest valid time
        }
        prevEnd = Math.max(prevEnd, end);
    }

    // Check for free time after the last meeting
    if (workEnd - prevEnd >= duration) {
        return minutesToTime(prevEnd);
    }

    return null; // No valid slot found
}

// Example usage:
const schedule = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
];
const duration = 60; // 60 minutes

console.log(findEarliestMeeting(schedule, duration)); // Output: "12:15"


/*
function getStartTime(schedule, duration) {

}
*/ 

/*
===================================================
    CODEWARS SOLUTION 1
===================================================
*/

function getStartTime(schedules, duration) {
    function toMinutes(s) {
      return s.split(':').reduce(function(h, m) {
        return parseInt(h) * 60 + parseInt(m);
      });
    }
    return schedules.reduce(function(p, n) {
      return p.concat(n);
    }, [['00:00', '09:00'], ['19:00', '24:00']]).sort().reduce(function(p, n) {
      if (!p.start && toMinutes(p.last) + duration <= toMinutes(n[0])) {
        p.start = p.last;
      }
      p.last = p.last < n[1] ? n[1] : p.last;
      return p;
    }, {last: '00:00', start: null}).start;
  }

/*
===================================================
    CODEWARS SOLUTION 2
===================================================
*/
function getStartTime(schedules, duration) {
    const toMinutes = (stringTime) => {
      const hours = +stringTime.split(':')[0];
      const minutes = +stringTime.split(':')[1];
      return hours * 60 + minutes;
    };
    
    const toHoursString = (minutesTime) => {
      let hours = Math.floor(minutesTime/60);
      let minutes = minutesTime % 60;
      hours > 10 ? hours = hours.toString() : hours = '0' + hours.toString();
      minutes > 10 ? minutes = minutes.toString() : minutes = '0' + minutes.toString();
      return hours + ':' + minutes;
    };
  
    const schedulesMinutes = schedules.map((schedule, schedulesIndex) => {
      if(schedule.length !== 0) {
          return schedule.map(diapason => {
            return [toMinutes(diapason[0]), toMinutes(diapason[1])];
        });
      } else {
        return [];
      };
    });
    
    const schedulesFreeMinutes = schedulesMinutes.map((schedule, schedulesIndex) => {
      if (schedule.length !== 0) {
        const freeDiapasons = [];
        for (let i = 1; i < schedule.length; i++){
          freeDiapasons.push([schedule[i - 1][1], schedule[i][0]]);
        }
        if (schedule[0][0] > 540) freeDiapasons.unshift([540, schedule[0][0]]);
        if (schedule[schedule.length - 1][1] < 1140) freeDiapasons.push([schedule[schedule.length - 1][1], 1140]);
        return freeDiapasons;
      } else {
        return [540, 1140];
      };
    });
    
    const schedulesMatchMinuets = schedulesFreeMinutes.map((schedule, schedulesIndex) => {
      return schedule.filter(diapason => {
        if (diapason[1] - diapason[0] >= duration) return true;
        return false;
      });
    });
    
    if (schedulesMatchMinuets) {
      let rezultDiapasons = schedulesMatchMinuets[0];
      for(let i = 1; i < schedulesMatchMinuets.length; i++) {
        const timeRezult = [];
        schedulesMatchMinuets[i].forEach(diapason => {
          rezultDiapasons.forEach(rezultDiapason => {
            let start, end;
            diapason[0] > rezultDiapason[0] ? start = diapason[0] : start = rezultDiapason[0];
            diapason[1] < rezultDiapason[1] ? end = diapason[1] : end = rezultDiapason[1];
            if (start < end && end - start >= duration) {
              timeRezult.push([start, end]);
            }
          });
        });
        rezultDiapasons = timeRezult;
      }
      
      if (rezultDiapasons.length) {
        return toHoursString(rezultDiapasons[0][0]);
      }
    }
    
    return null;
  }

/*
===================================================
    CODEWARS SOLUTION 3
===================================================
*/
function getStartTime(schedules, duration) {
    const workStart = 9 * 60; // 09:00 in minutes
    const workEnd = 19 * 60; // 19:00 in minutes

    // Convert time string "hh:mm" to minutes from 00:00
    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Convert minutes from 00:00 to time string "hh:mm"
    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
        const mins = (minutes % 60).toString().padStart(2, '0');
        return `${hours}:${mins}`;
    }

    // Flatten and sort all busy times
    let busyTimes = [];
    for (const schedule of schedules) {
        for (const [start, end] of schedule) {
            busyTimes.push([timeToMinutes(start), timeToMinutes(end)]);
        }
    }
    busyTimes.sort((a, b) => a[0] - b[0]);

    // Merge overlapping busy times
    let mergedBusyTimes = [];
    for (const [start, end] of busyTimes) {
        if (mergedBusyTimes.length === 0 || mergedBusyTimes[mergedBusyTimes.length - 1][1] < start) {
            mergedBusyTimes.push([start, end]);
        } else {
            mergedBusyTimes[mergedBusyTimes.length - 1][1] = Math.max(mergedBusyTimes[mergedBusyTimes.length - 1][1], end);
        }
    }

    // Find free slots
    let lastEnd = workStart;
    for (const [start, end] of mergedBusyTimes) {
        if (lastEnd + duration <= start) {
            return minutesToTime(lastEnd);
        }
        lastEnd = Math.max(lastEnd, end);
    }

    // Check the time after the last meeting until the end of the workday
    if (lastEnd + duration <= workEnd) {
        return minutesToTime(lastEnd);
    }

    // No suitable time found
    return null;
}

/*
solution 4
*/ 
function getStartTime(schedules, duration) {
    // Helper function to convert "hh:mm" to minutes since 09:00
    function timeToMinutes(time) {
      const [hours, minutes] = time.split(':').map(Number);
      return (hours - 9) * 60 + minutes;
    }
  
    // Helper function to convert minutes since 09:00 to "hh:mm"
    function minutesToTime(minutes) {
      const hours = Math.floor(minutes / 60) + 9;
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
  
    // Convert all schedules to busy intervals in minutes
    const busyIntervals = [];
    for (const personSchedule of schedules) {
      for (const [start, end] of personSchedule) {
        busyIntervals.push([timeToMinutes(start), timeToMinutes(end)]);
      }
    }
  
    // Sort the intervals by start time
    busyIntervals.sort((a, b) => a[0] - b[0]);
  
    // Merge overlapping intervals
    const mergedIntervals = [];
    for (const interval of busyIntervals) {
      if (mergedIntervals.length === 0 || mergedIntervals[mergedIntervals.length - 1][1] < interval[0]) {
        mergedIntervals.push(interval);
      } else {
        mergedIntervals[mergedIntervals.length - 1][1] = Math.max(mergedIntervals[mergedIntervals.length - 1][1], interval[1]);
      }
    }
  
    // Check for available slots between merged intervals
    let lastEnd = 0; // Starting from 09:00 which is 0 in minutes
    for (const [start, end] of mergedIntervals) {
      if (start - lastEnd >= duration) {
        return minutesToTime(lastEnd);
      }
      lastEnd = end;
    }
  
    // Check the time after the last meeting until the end of the workday (19:00 which is 600 in minutes)
    if (600 - lastEnd >= duration) {
      return minutesToTime(lastEnd);
    }
  
    // If no suitable time found, return null
    return null;
  }
  
  // Example usage:
  const schedules = [
    [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
    [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
    [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
  ];
  console.log(getStartTime(schedules, 60)); // should return "12:15"


//   SOLUTION 5

function getStartTime(schedules, duration) {
    function timeToMinutes(t) {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    }
  
    function minutesToTime(m) {
      const h = Math.floor(m / 60);
      const minutes = m % 60;
      return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  
    const workStart = timeToMinutes("09:00");
    const workEnd = timeToMinutes("19:00");
  
   
    const allMeetings = [];
    for (const personSchedule of schedules) {
      for (const meeting of personSchedule) {
        const start = timeToMinutes(meeting[0]);
        const end = timeToMinutes(meeting[1]);
        allMeetings.push([start, end]);
      }
    }
  
    allMeetings.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  
    const freeTimes = [];
    let currentEnd = workStart;
  
    for (const [start, end] of allMeetings) {
      if (start > currentEnd) {
        freeTimes.push([currentEnd, start]);
      }
      currentEnd = Math.max(currentEnd, end);
    }
  
    if (currentEnd < workEnd) {
      freeTimes.push([currentEnd, workEnd]);
    }
  
    for (const [start, end] of freeTimes) {
      if (end - start >= duration) {
        return minutesToTime(start);
      }
    }
  
    return null;
  }


//   SOLUTION 6
function getStartTime(schedules, duration) {
    // Business hours
    const startOfDay = '09:00';
    const endOfDay = '19:00';
  
    // Convert a time string to minutes
    const toMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
  
    // Convert minutes to a time string
    const toTimeString = (minutes) => {
      const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
      const mins = (minutes % 60).toString().padStart(2, '0');
      return `${hours}:${mins}`;
    };
  
    // Merge and sort all schedules
    const allMeetings = schedules.flat().sort((a, b) => toMinutes(a[0]) - toMinutes(b[0]));
  
    // Merge overlapping meetings
    let mergedMeetings = [];
    for (let [start, end] of allMeetings) {
      if (mergedMeetings.length === 0 || toMinutes(start) > toMinutes(mergedMeetings[mergedMeetings.length - 1][1])) {
        mergedMeetings.push([start, end]);
      } else {
        let lastMeeting = mergedMeetings[mergedMeetings.length - 1];
        lastMeeting[1] = toMinutes(end) > toMinutes(lastMeeting[1]) ? end : lastMeeting[1];
      }
    }
  
    // Try to find a gap for the meeting
    let potentialStart = toMinutes(startOfDay);
    for (let [start, end] of mergedMeetings) {
      let startMinutes = toMinutes(start);
      if (startMinutes - potentialStart >= duration) {
        return toTimeString(potentialStart);
      }
      potentialStart = Math.max(potentialStart, toMinutes(end));
    }
  
    // Check if a meeting can start after the last meeting before the end of the day
    if (toMinutes(endOfDay) - potentialStart >= duration) {
      return toTimeString(potentialStart);
    }
  
    // If no suitable time was found
    return null;
  }

//   SOLUTION

function getStartTime(schedules, duration) {
    if (schedules.filter(schedule => schedule.length > 1).length < schedules.length) return null;
    // init
    let freeTime = [];
    schedules.forEach(person => freeTime.push([]));
    
    // get free time for each person
    schedules.forEach((person, ip) => {
      if (person[0][0] !== '09:00') freeTime[ip].push([timeInMins('09:00'), timeInMins(person[0][0]) - duration]); // after 9 / before first meeting
      person.forEach((meeting, im) => {
        if (im !== person.length - 1 && meeting[1] !== person[im + 1][0]) freeTime[ip].push([timeInMins(meeting[1]), timeInMins(person[im + 1][0]) - duration]); // most meetings
        else if (im == person.length - 1 && meeting[1] !== '19:00') freeTime[ip].push([timeInMins(meeting[1]), timeInMins('19:00') - duration]); // time at the end
      })
    })
    
    // get possible times for the start of the meeting
    freeTime = freeTime.map(person => person.filter(time => time[1] >= time[0]));
    
    // get earliest possible time
    let earliestTimes = [];
    freeTime.forEach(person => {
      earliestTimes.push(person[0][0]);
    })
    let earliestPossible = Math.max(...earliestTimes);
    // get latest possible time
    let latestTimes = [];
    freeTime.forEach(person => {
      latestTimes.push(person[person.length - 1][1]);
    })
    let latestPossible = Math.min(...latestTimes);
    
    // find start time suitable for all
    for (let i = earliestPossible; i < latestPossible + 1; i++) {
      let suitableTimes = freeTime.map(person => {
        return person.map(time => time[0] <= i && time[1] >= i ? true : false);
      })
      let timeFound = true;
      suitableTimes.forEach(person => {if (!person.includes(true)) timeFound = false;})
      if (timeFound) return minutesAsTimeString(i);
    }
    
    return null;
  }
  
  function timeInMins(timeString) {
    return parseInt(timeString.substring(0, 2)) * 60 + parseInt(timeString.substring(3));
  }
  
  function minutesAsTimeString(minutes) {
    let date = new Date(1970, 0, 1);
    date.setMinutes(minutes);
    return date.toTimeString().substring(0, 5);
  }

// SOLUTION
function getStartTime(schedules, duration) {
    const timeToMinutes = time => {
      const [hours, minutes] = time.split`:`;
      return hours * 60 + +minutes;
    }
    
    const minutesToTime = n => {
      let hours = Math.floor(n / 60),
          minutes = n % 60;
      
      [hours, minutes] = [hours, minutes].map(time => time.toString().padStart(2, "0"));
      return `${hours}:${minutes}`;
    }
    
    const busyRanges = [
      [timeToMinutes("00:00"), timeToMinutes("09:00")],
      [timeToMinutes("19:00"), timeToMinutes("23:59")]
    ];
    
    for (const schedule of schedules) {
      nextSchedule: for (const [startStr, endStr] of schedule) {
        const start = timeToMinutes(startStr),
              end = timeToMinutes(endStr);
        
        for (let i = 0; i < busyRanges.length; i++) {
          const [busyRangeStart, busyRangeEnd] = busyRanges[i];
          
          if (start < busyRangeEnd && end > busyRangeStart) {
            busyRanges[i] = [Math.min(start, busyRangeStart), Math.max(end, busyRangeEnd)];
            continue nextSchedule;
          }
        }
        
        busyRanges.push([start, end]);
      }
    }
    
    busyRanges.sort(([s1, e1], [s2, e2]) => s1 - s2);
    
    for (let i = 1; i < busyRanges.length; i++) {
      const [prevStart, prevEnd, curStart, curEnd] = [busyRanges[i - 1][0], busyRanges[i - 1][1], busyRanges[i][0], busyRanges[i][1]];
      if (prevStart < curStart && prevEnd > curEnd) busyRanges.splice(i--, 1);
    }
    
    for (let i = 1; i < busyRanges.length; i++) {
      const [prevEnd, curStart] = [busyRanges[i - 1][1], busyRanges[i][0]];
      if (curStart - prevEnd >= duration) return minutesToTime(prevEnd);
    }
    
    return null;
  }