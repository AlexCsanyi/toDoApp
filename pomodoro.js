let workSessions = TAFFY([]);

window.onload = function() {
  workSessions();
};

const upperButtons = document.getElementById("upperButtons"),
  work = document.getElementById("work"),
  longBreak = document.getElementById("longBreak"),
  shortBreak = document.getElementById("shortBreak"),
  timer = document.getElementById("timer"),
  mode = document.getElementById("mode"),
  addTime = document.getElementById("addTime"),
  time = document.getElementById("time"),
  minutes = document.getElementById("minutes"),
  seconds = document.getElementById("seconds"),
  reduceTime = document.getElementById("reduceTime"),
  lowerButtons = document.getElementById("lowerButtons"),
  start = document.getElementById("start"),
  pause = document.getElementById("pause"),
  resume = document.getElementById("resume"),
  reset = document.getElementById("reset"),
  alarm = document.getElementById("alarm");

let month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

let clock,
  timerId,
  clockInterval,
  count,
  workTime = "25",
  longBreakTime = "15",
  shortBreakTime = "05";

function intervalTimer(callback, interval) {
  let startTime,
    remaining = 0,
    state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

  this.pause = function() {
    if (state != 1) {
      return;
    }

    remaining = interval - (new Date() - startTime);
    window.clearInterval(timerId);
    state = 2;
  };

  this.resume = function() {
    clearTimeout(timerId);
    if (state != 2) {
      return;
    }

    state = 3;
    window.setTimeout(this.timeoutCallback, remaining);
  };

  this.timeoutCallback = function() {
    if (state != 3) {
      return;
    }

    callback();

    startTime = new Date();
    timerId = window.setInterval(callback, interval);
    state = 1;
  };

  startTime = new Date();
  timerId = window.setInterval(callback, interval);
  state = 1;
}

work.addEventListener("click", workOn);
function workOn() {
  mode.innerHTML = this.innerHTML;
  minutes.innerHTML = workTime;
  seconds.innerHTML = "00";
  alarm.pause();
}

longBreak.addEventListener("click", longBreakOn);
function longBreakOn() {
  mode.innerHTML = this.innerHTML;
  minutes.innerHTML = longBreakTime;
  seconds.innerHTML = "00";
  alarm.pause();
}

shortBreak.addEventListener("click", shortBreakOn);
function shortBreakOn() {
  mode.innerHTML = this.innerHTML;
  minutes.innerHTML = shortBreakTime;
  seconds.innerHTML = "00";
  alarm.pause();
}

reset.addEventListener("click", function() {
  work.addEventListener("click", workOn);
  longBreak.addEventListener("click", longBreakOn);
  shortBreak.addEventListener("click", shortBreakOn);
  addTime.addEventListener("click", addTimeButton);
  reduceTime.addEventListener("click", reduceTimeButton);
  start.addEventListener("click", startTimer);
  pause.removeEventListener("click", pauseOn);
  resume.removeEventListener("click", resumeOn);
  clearInterval(timerId);
  alarm.pause();
  work.removeAttribute("style");
  work.removeAttribute("onclick");
  longBreak.removeAttribute("style");
  longBreak.removeAttribute("onclick");
  shortBreak.removeAttribute("style");
  shortBreak.removeAttribute("onclick");

  mode.innerHTML = "Work";
  minutes.innerHTML = "25";
  seconds.innerHTML = "00";

  workTime = "25";
  longBreakTime = "15";
  shortBreakTime = "05";
});

function leadingZeros(i) {
  return ("00" + i).slice(-2);
}

function timeSaver() {
  if (mode.innerHTML == "Work") {
    workTime = minutes.innerHTML;
  } else if (mode.innerHTML == "Long Break") {
    longBreakTime = minutes.innerHTML;
  } else {
    shortBreakTime = minutes.innerHTML;
  }
}

addTime.addEventListener("click", addTimeButton);
function addTimeButton() {
  minutes.innerHTML = parseInt(minutes.innerHTML) + 1;
  minutes.innerHTML = leadingZeros(minutes.innerHTML);
  if (minutes.innerHTML == 61) {
    minutes.innerHTML = "01";
  }

  timeSaver();
}

reduceTime.addEventListener("click", reduceTimeButton);
function reduceTimeButton() {
  minutes.innerHTML = parseInt(minutes.innerHTML) - 1;
  minutes.innerHTML = leadingZeros(minutes.innerHTML);
  if (minutes.innerHTML == 0) {
    minutes.innerHTML = "60";
  }

  timeSaver();
}

function pauseOn() {
  clockInterval.pause();
  pause.setAttribute("style", "display: none !important;");
  resume.setAttribute("style", "display: inline-block !important;");
}

function resumeOn() {
  clockInterval.resume();
  resume.setAttribute("style", "display: none !important;");
  pause.setAttribute("style", "display: inline-block !important;");
}

function myAlertFunction() {
  let modal = document.getElementById("myModal");
  let span = document.getElementsByClassName("close")[0];
  let textContent = document.getElementById("modal-text");
  modal.style.display = "block";
  textContent.innerHTML =
    `${mode.innerHTML}` + " session is on - you need to wait till the end!";
  span.onclick = function() {
    modal.style.display = "none";
  };
}

start.addEventListener("click", startTimer);
function startTimer() {
  work.removeEventListener("click", workOn);
  longBreak.removeEventListener("click", longBreakOn);
  shortBreak.removeEventListener("click", shortBreakOn);
  addTime.removeEventListener("click", addTimeButton);
  reduceTime.removeEventListener("click", reduceTimeButton);
  start.removeEventListener("click", startTimer);
  resume.addEventListener("click", resumeOn);
  pause.addEventListener("click", pauseOn);
  work.setAttribute(
    "style",
    "color: var(--clr-dark); border-color: var(--clr-dark);"
  );
  longBreak.setAttribute(
    "style",
    "color: var(--clr-dark); border-color: var(--clr-dark);"
  );
  shortBreak.setAttribute(
    "style",
    "color: var(--clr-dark); border-color: var(--clr-dark);"
  );
  work.setAttribute("onclick", "myAlertFunction()");
  longBreak.setAttribute("onclick", "myAlertFunction()");
  shortBreak.setAttribute("onclick", "myAlertFunction()");

  clockInterval = new intervalTimer(function() {
    if (seconds.innerHTML == 0) {
      if (minutes.innerHTML !== "00") {
        minutes.innerHTML -= 1;
        minutes.innerHTML = leadingZeros(minutes.innerHTML);
        seconds.innerHTML = "59";
      } else if (minutes.innerHTML == "00") {
        clearInterval(clock);
        alarm.play();
        work.addEventListener("click", workOn);
        longBreak.addEventListener("click", longBreakOn);
        shortBreak.addEventListener("click", shortBreakOn);
        addTime.addEventListener("click", addTimeButton);
        reduceTime.addEventListener("click", reduceTimeButton);
        start.addEventListener("click", startTimer);
        pause.removeEventListener("click", pauseOn);
        resume.removeEventListener("click", resumeOn);
        clearInterval(timerId);
        work.removeAttribute("style");
        work.removeAttribute("onclick");
        longBreak.removeAttribute("style");
        longBreak.removeAttribute("onclick");
        shortBreak.removeAttribute("style");
        shortBreak.removeAttribute("onclick");

        workTime = "25";
        longBreakTime = "15";
        shortBreakTime = "05";

        if (mode.innerHTML === "Work") {
          minutes.innerHTML = workTime;
        } else if (mode.innerHTML === "Break") {
          minutes.innerHTML = shortBreakTime;
        } else {
          minutes.innerHTML = longBreakTime;
        }

        seconds.innerHTML = "00";

        if (mode.innerHTML == "Work") {
          let finishedWorkSession = {
            month: month[new Date().getMonth()],
            date: new Date().getDate(),
            hour: new Date().getHours()
          };
          workSessions.insert(finishedWorkSession);
        }
      }
    } else if (seconds.innerHTML !== 0) {
      seconds.innerHTML -= 1;
      seconds.innerHTML = leadingZeros(seconds.innerHTML);
    }
  }, 1000);
}

workSessions.store("workSessions");

/* -------------  DATA  -------------  */

/* Graph Selector */

function toggleCharts(element) {
  element.value == 1
    ? (document.getElementById("activityByMonthChart").style.display = "none")
    : (document.getElementById("activityByMonthChart").style.display = "block");
  element.value == 0
    ? (document.getElementById("activityByHour").style.display = "none")
    : (document.getElementById("activityByHour").style.display = "block");
}

function display2() {
  document.getElementById("activityByMonthChart").className("nonVisible");
}

/* Get Monthly and Daily Data */
document.getElementById("totalOverall").innerHTML = `${workSessions().count()}`;
document.getElementById("totalCurrentMonth").innerHTML = `${workSessions()
  .filter({
    month: "September"
  })
  .count()}`;
let dates = workSessions({ month: "September" }).distinct("date");
let workSessionsPerDay = [];

dates.forEach(element => {
  workSessionsPerDay.push(
    workSessions()
      .filter({ date: element })
      .count()
  );
});

let ctx = document.getElementById("activityByMonthChart");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: dates,
    datasets: [
      {
        label: "No. of work sessions in September",
        data: workSessionsPerDay,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "No. of sessions"
          },
          ticks: {
            beginAtZero: true
          }
        }
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Date"
          }
        }
      ]
    }
  }
});

/* Get Hourly Data */

let testing = workSessions().select("hour");

let workSessionsPerHour = [];

for (i = 0; i <= 24; i++) {
  if (workSessions().filter({ hour: i })) {
    workSessionsPerHour.push(
      workSessions()
        .filter({ hour: i })
        .count()
    );
  } else {
    workSessionsPerHour.push(0);
  }
}

let ctx2 = document.getElementById("activityByHour");
var myChart = new Chart(ctx2, {
  type: "line",
  data: {
    labels: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23
    ],
    datasets: [
      {
        label: "No. of work sessions by hour",
        data: workSessionsPerHour,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "No. of sessions"
          },
          ticks: {
            beginAtZero: true
          }
        }
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Hour of Day"
          }
        }
      ]
    }
  }
});
