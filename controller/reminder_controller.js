let database = require("../database").Database;
let account = require("../database").Account;
const fetch = require("node-fetch");
let Show=true
let Tag_show=true


let remindersController = {
  list: async (req, res) => {
    let weatherkey="f64eb826175eddf4f4465398309206bb"
    let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Vancouver&appid=${weatherkey}`)
    let parseweather=await weather.json()
    let name =req.user.name 
    res.render("reminder/index", { reminders: database[name].reminders,
                                   weatherdata: parseweather,
                                    Username: name,
                                    friendsReminders: database[name].friendReminders, 
                                    friendlist: database[name].friends});
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: async (req, res) => {
    let reminderToFind = req.params.id;
    let name =req.user.name; 
    let searchResult = database[name].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let weatherkey="f64eb826175eddf4f4465398309206bb"
    let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Vancouver&appid=${weatherkey}`)
    let parseweather=await weather.json()

    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult,
                                                Show: Show,
                                                Tag_show: Tag_show,
                                                Username: name });
    } else {
      res.render("reminder/index", { reminders: database[name].reminders,
                                     weather: parseweather,
                                     Username: name});
    }
  },

  create: (req, res) => {
    let name =req.user.name 
    let reminder = {
      id: database[name].reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      tag: [req.body.tag],
      completed: false,
      date: req.body.date,
      subtask: []
    };
    database[name].reminders.push(reminder);
    res.redirect("/reminders");
  }, 

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let name =req.user.name //Benny 
    let searchResult = database[name].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult,
                                  Username: name});
  },

  update: (req, res) => {
    let name = req.user.name;
    let reminderToFind = req.params.id;
    let searchResult = database[name].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let num = database[name].reminders.indexOf(searchResult)
    searchResult.title = req.body.title
    searchResult.description = req.body.description
    searchResult.date = req.body.date
    if (req.body.completed == "true") {
      searchResult.completed = true
    } else if (req.body.completed == "false") {
      searchResult.completed = false
    };

    database[name].reminders[num]=searchResult
    res.redirect("/reminder/" + reminderToFind)
  },

  delete: (req, res) => {
    let reminderToFind = req.params.id;
    let name = req.user.name;
    let searchResult = database[name].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
      });

    if(searchResult !== -1){
      let result = database[name].reminders.filter(elem => elem !== searchResult)
      database[name].reminders=result
    }
    res.redirect("/reminders");
  },

  subtask: (req,res) => {
    let reminderToFind = req.params.id;
    let name = req.user.name;
    let inputvalue=req.body.buttonsub
    let searchResult = database[name].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let num = database[name].reminders.indexOf(searchResult)
    if(inputvalue== "add"){
      let Show=false
      res.render("reminder/single-reminder", { reminderItem: searchResult,
                                                Show: Show,
                                                Tag_show: Tag_show,
                                                Username: name })

    } else if (inputvalue == "Submit") {
      database[name].reminders[num].subtask.push(req.body.subtask)
      let Show=true
      res.render("reminder/single-reminder", { reminderItem: searchResult,
                                                Show: Show,
                                                Tag_show: Tag_show,
                                                Username: name })
    } else {
        let subtask = database[name].reminders[num].subtask[inputvalue]
        let result = database[name].reminders[num].subtask.filter(elem => elem !== subtask)
        database[name].reminders[num].subtask=result
        res.redirect("/reminder/" + reminderToFind)
    }
  },

  tags: (req,res) => {
    let reminderToFind = req.params.id;
    let name = req.user.name;
    let inputvalue=req.body.buttonsub
    let searchResult = database[name].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let person = database[name].reminders.indexOf(searchResult)
    
    if (inputvalue== "add") {
      let Tag_show=false
      res.render("reminder/single-reminder", { reminderItem: searchResult,
                                                Show: Show,
                                                Tag_show: Tag_show,
                                                Username: name})
    } else if (inputvalue == "Submit") {
      database[name].reminders[person].tag.push(req.body.tag)
      let Tag_show=true
      res.render("reminder/single-reminder", { reminderItem: searchResult,
                                                Show:Show,
                                                Tag_show: Tag_show,
                                                Username: name})
    } else {
      let tag = database[name].reminders[person].tag[inputvalue]
      let result = database[name].reminders[person].tag.filter(elem => elem !== tag)
      database[name].reminders[person].tag=result
      res.redirect("/reminder/" + reminderToFind)
    }
  }
};


module.exports = remindersController
