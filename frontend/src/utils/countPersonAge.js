// Function that gets age from date of birth and date of death (or today's date if DOD isn't set)
function countPersonAge(dob, dod) {
  const birthday = new Date(dob);
  const lastDay = dod ? new Date(dod) : new Date();
  let thisYear = 0;
  if (lastDay.getMonth() < birthday.getMonth()) {
    thisYear = 1;
  } else if ((lastDay.getMonth() === birthday.getMonth()) && lastDay.getDate() < birthday.getDate()) {
    thisYear = 1;
  }
  return lastDay.getFullYear() - birthday.getFullYear() - thisYear;
}

module.exports = countPersonAge;