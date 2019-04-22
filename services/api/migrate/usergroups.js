module.exports.usergroups = [
  {
    data: { name: "Free" },
    actions: ["View", "Edit", "Remove", "Create"]
  },
  {
    data: { name: "Premier" },
    actions: ["Clone", "Template"]
  },
  {
    data: { name: "Reviewer" },
    actions: ["XView", "Rate", "Comment", "Approve", "Reject"]
  },
  {
    data: { name: "Human Resource" },
    actions: ["XView", "Download", "Email", "Search"]
  },
  {
    data: { name: "Developer" },
    actions: [
      "Clone",
      "Search",
      "Template",
      "XView",
      "XEdit",
      "XRemove",
      "XCreate",
      "Download",
      "Email",
      "Rate",
      "Comment",
      "Approve",
      "Reject"
    ]
  }
];
