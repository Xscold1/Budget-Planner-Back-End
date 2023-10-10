const getDateToday = () =>{
  let dateNow = new Date(Date.now())

  let changeTimeZone = new Intl.DateTimeFormat('en-US', {timeZone:'Singapore'}).format(dateNow);
  
  let splitDate = changeTimeZone.split("/")
  
  splitDate.unshift.apply(splitDate, splitDate.splice(2,2));

  let getFinalDate = splitDate.join("-");

  return getFinalDate
}

module.exports = getDateToday