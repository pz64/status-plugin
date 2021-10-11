
var outputLayout = document.querySelector('.body-preview')
var subjectLayout = document.querySelector('.subject-preview')


var toEmail = document.querySelector('.new-note input[name="to"]')
var ccEmail = document.querySelector('.new-note input[name="cc"]')

var subject = document.querySelector('.new-note input[name="subject"]')
var projectName = document.querySelector('.new-note input[name="project-name"]')
var date = document.querySelector('.new-note input[name="date"]')

var workDone = document.querySelector('.new-note textarea[name="work-done"');
var toDo = document.querySelector('.new-note textarea[name="to-do"]');

var addBtn = document.querySelector('.add');


toEmail.addEventListener('input', saveData);
ccEmail.addEventListener('input', saveData);
subject.addEventListener('input', saveData);
projectName.addEventListener('input', saveData);
date.addEventListener('input', saveData);
workDone.addEventListener('input', saveData);
toDo.addEventListener('input', saveData);

toDo.addEventListener('input', saveData);

addBtn.addEventListener('click', showFullScreen);

workDone.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
  saveData();
});

toDo.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
  saveData();
});


outputLayout.addEventListener('click', function () {
  copyToClip(outputLayout.innerHTML);
});

subjectLayout.addEventListener('click', function () {
  copyToClip(subjectLayout.innerHTML);
});


/* generic error handler */
function onError(error) {
  console.log(error);
}

initialize();

function initialize() {

  subject.value = "Status Report - " + getFromattedDate();
  date.value = getFromattedDate();

  loadData();
}


function getFromattedDate() {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const output = month + ' ' + day + ', ' + year;
  return output;
}


function saveData() {

  var db = browser.storage.local

  db.set({ ['to']: toEmail.value });
  db.set({ ['cc']: ccEmail.value });
  db.set({ ['project_name']: projectName.value });
  db.set({ ['work_done']: workDone.value });
  db.set({ ['to_do']: toDo.value });

  previewData();
}


function previewData() {

  var template =
    "<div>" +
    "<div>Project: " + getProjectName() + "<div>Date: " + getDate() + "</div>" +
    "</div>" +
    "<div><br></div>" +
   showWorkLabel() +
    getworkDoneData() +
    showTodoLabel() +
    "<div>" +
    gettoDoData() +
    "<div>Thanks,</div>" +
    "</div>" +
    "</div>"
  outputLayout.innerHTML = template;

  subjectLayout.innerHTML = subject.value;
}

function getworkDoneData() {
  var data = workDone.value;
  var array = data.split(/\n/);
  var preview = "<ul>"
  for (const data in array) {
    if (array[data].trim() != "")
      preview += "<li>" +addPeriod(fixLine(array[data])) + "</li>";
  }
  preview += "</ul>"
  return preview
}

function showWorkLabel() {
  var data = workDone.value;
  if(data.trim() == "")
  return "";
  return "<div>Work Done:</div>";
}




function gettoDoData() {
  var data = toDo.value;
  var array = data.split(/\n/);
  var preview = "<ul>"
  for (const data in array) {
    if (array[data].trim() != "")
      preview += "<li>" + addPeriod(fixLine(array[data])) + "</li>";
  }
  preview += "</ul>"
  return preview
}

function showTodoLabel() {
  var data = toDo.value;
  if(data.trim() == "")
  return "";
  return "<div>To Do:</div>";
}



function getProjectName() {
  var data = projectName.value.trim();
  return fixLine(data);
}

function fixLine(string) {
  var trimmed = string.trim();
  var punctuationFixed = fixPunctuations(trimmed);
  var evenSpaces = removeSpaces(punctuationFixed);
  var capitalFirstLetter = capitalizeFirstWord(evenSpaces);
  return capitalFirstLetter;
}

function addPeriod(str) {
  if (str[str.length - 1] != '.')
  return str + ".";
  else return str;
}

function removeSpaces(str) {
  return str.replace(/^\s+|\s+$/g, "")
}

function getDate() {
  var data = date.value;
  return data
}

function capitalizeFirstWord(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

function fixPunctuations(str) {
  return str
    .replace(/\s*\(\s*/g, " (")
    .replace(/\s*\)\s*/g, ") ")
    .replace(/\s*\[\s*/g, " [")
    .replace(/\s*\]\s*/g, "] ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\.\s*/g, ". ")
    .replace(/\s*;\s*/g, "; ")
    .replace(/\s*:\s*/g, ": ")
    ;
}

function loadData() {

  var db = browser.storage.local;

  db.get(['to'], function (result) {
    if (result.to !== undefined)
      toEmail.value = result.to;
      previewData();
  })

  db.get(['cc'], function (result) {
    if (result.cc !== undefined)
      ccEmail.value = result.cc;
      previewData();
  })

  db.get(['project_name'], function (result) {
    if (result.project_name !== undefined)
      projectName.value = result.project_name;
      previewData();
  })

  db.get(['work_done'], function (result) {
    if (result.work_done !== undefined)
      workDone.value = result.work_done;
      previewData();
  })

  db.get(['to_do'], function (result) {
    if (result.to_do !== undefined)
      toDo.value = result.to_do;
      previewData();
  })
}

function showFullScreen() {
  // var mailBody = "test";
  // var body = "<ul><li> Unordered Disc Bullet</li></ul><ol><li>Ordered Uppercase Alphabet Bullet</li></ol>";
  // window.location = "mailto:?subject=Your mate might be interested...&body=<div style='padding: 0;'><div style='padding: 0;'><p>I found this on the site I think you might find it interesting.  <a href='@(Request.Url.ToString())' >Click here </a></p></div></div>";
  browser.tabs.create({
    url: "quicknote.html"
  });
}


function copyToClip(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}