document
  .getElementById("issueInputForm")
  .addEventListener("submit", submitIssue);

function submitIssue(e) {
  // getting and putting form value to localstorage
  const getInputValue = (id) => document.getElementById(id).value;
  const description = getInputValue("issueDescription");
  const severity = getInputValue("issueSeverity");
  const assignedTo = getInputValue("issueAssignedTo");
  const id = Math.floor(Math.random() * 100000000) + "";
  const status = "Open";

  const issue = { id, description, severity, assignedTo, status };
  let issues = [];

  // if value is present then getting the values to issues array first
  if (localStorage.getItem("issues")) {
    issues = JSON.parse(localStorage.getItem("issues"));
  }
  // adding new value to issues array
  issues.push(issue);
  localStorage.setItem("issues", JSON.stringify(issues));

  // input form clear
  document.getElementById("issueInputForm").reset();

  // issue counter
  if (localStorage.totalIssueCount && localStorage.openedIssueCount) {
    localStorage.totalIssueCount = Number(localStorage.totalIssueCount) + 1;
    localStorage.openedIssueCount = Number(localStorage.openedIssueCount) + 1;
  } else {
    localStorage.totalIssueCount = 1;
    localStorage.openedIssueCount = 1;
  }
  document.getElementById("totalIssue").innerHTML =
    localStorage.totalIssueCount;
  document.getElementById("openedIssue").innerHTML =
    localStorage.openedIssueCount;
  // issue counter end

  // showing the localstorage value to html page
  fetchIssues();
  e.preventDefault();
}

// close button
function setStatusClosed(id) {
  const issues = JSON.parse(localStorage.getItem("issues"));
  const currentIssue = issues.find((issue) => issue.id == id);
  currentIssue.status = `<strike>${currentIssue.status}</strike>`;
  currentIssue.severity = `<strike>${currentIssue.severity}</strike>`;
  currentIssue.assignedTo = `<strike>${currentIssue.assignedTo}</strike>`;
  currentIssue.description = `<strike>${currentIssue.description}</strike>`;
  currentIssue.status = "Closed";
  if (Number(localStorage.openedIssueCount) > 0) {
    localStorage.openedIssueCount = Number(localStorage.openedIssueCount) - 1;
  }
  localStorage.setItem("issues", JSON.stringify(issues));
  fetchIssues();
}

// delete button
const deleteIssue = (id) => {
  const issues = JSON.parse(localStorage.getItem("issues"));
  const foundIssue = issues.find((issue) => issue.id == id);
  var remainingIssues;
  if (foundIssue.status == "Closed") {
    if (Number(localStorage.totalIssueCount) > 0) {
      localStorage.totalIssueCount = Number(localStorage.totalIssueCount) - 1;
    }
    remainingIssues = issues.filter((issue) => issue.id != id);
    console.log(remainingIssues);
  } else {
    if (Number(localStorage.openedIssueCount) > 0) {
      localStorage.totalIssueCount = Number(localStorage.totalIssueCount) - 1;
      localStorage.openedIssueCount = Number(localStorage.openedIssueCount) - 1;
    }
    remainingIssues = issues.filter((issue) => issue.id != id);
    console.log(remainingIssues);
  }

  // const remainingIssues = issues.filter((issue) => issue.id != id);

  localStorage.setItem("issues", JSON.stringify(remainingIssues));
  fetchIssues();
};

// showing localstorage data in html dom
const fetchIssues = () => {
  const issues = JSON.parse(localStorage.getItem("issues"));
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";

  for (var i = 0; i < issues.length; i++) {
    const { id, description, severity, assignedTo, status } = issues[i];

    issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label label-info"> ${status} </span></p>
                              <h3> ${description} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <button onclick="setStatusClosed(${id})" class="btn btn-warning" >Close</button>
                              <button onclick="deleteIssue(${id})" class="btn btn-danger" >Delete</button>
                              </div>`;
  }

  document.getElementById("openedIssue").innerHTML =
    localStorage.openedIssueCount;
  document.getElementById("totalIssue").innerHTML =
    localStorage.totalIssueCount;
};
