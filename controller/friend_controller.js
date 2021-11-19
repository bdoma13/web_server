let database = require("../database").Database;
let account = require("../database").Account;
const fetch = require("node-fetch")

let checkfriend = (searched,current) => {
    let result = current.friends.find(function (user) {
        return user.id == searched.id;
        });
    return result
}

let friendcontroller = {
    Show: async (req,res)=>{
        // The picture in unsplash is too big we choose another fake api as the suer profile pictures

                    // let key="UXjvMBht7TwobeqgUBo9O1Vzf7t1YsYohEc28tUMB6c"
                    // let photos = await fetch(`https://api.unsplash.com/search/photos?query=cats&client_id=${key}`)
                    // let parsedphotos= await photos.json()
        let user_id = req.user.id;
        // show the current user friend list
        let name =req.user.name
        let currentuser = account.find(function (user) {
            return user.id == user_id;
            });
        res.render("Social/friend", {account:currentuser.friends,
                                     error:0,
                                     alluser:account,
                                     listener:"filter()",
                                     Username:name})
    },

    add: (req,res) => {
        // send the email to the client
        let email = req.body.useremail
        // send the current user id
        let user_id = req.user.id;
        let name =req.user.name
        // find the current user friend list
        let currentuser = account.find(function (user) {
            return user.id == user_id;
            });
        // check the email exist in the account database or not
        let searchuser = account.find(function (user) {
            return user.email == email;
            });

        //Show the error if add account repeat or same with current user
        //If no error add friend to current friends list and add current user the added user friends list
        if(searchuser == undefined){
            res.render("Social/friend", {account:currentuser.friends,
                                         error:1,
                                         alluser:account,
                                         listener:"filter()",
                                         Username:name});

        }else if(searchuser.id == currentuser.id){
            res.render("Social/friend", {account:currentuser.friends,
                                         error:2,
                                         alluser:account,
                                         listener:"filter()",
                                         Username:name});

        }else if(checkfriend(searchuser,currentuser) != undefined){
            res.render("Social/friend", {account:currentuser.friends,
                                         error:3,
                                         alluser:account,
                                         listener:"filter()",
                                         Username:name});

        }else{
            currentuser.friends.push({id:searchuser.id,name:searchuser.name,email:searchuser.email})
            searchuser.friends.push({id: currentuser.id,name: currentuser.name,email: currentuser.email})
            res.render("Social/friend", {account:currentuser.friends,
                                         error:0,
                                         alluser:account,
                                         listener:"filter()",
                                         Username:name})
        }
    },

    View:(req,res)=>{
        // get the friend name from url
        let name = req.params.name 

        // adding their reminders to your list
        let user = req.user.name
        
        // send the friend reminders and name to the ejs
        res.render("Social/friend_reminders", { reminders: database[name].reminders,
                                                friendname:name });
    },

    friendRemind: (req, res) => {
        let reminderToFind = req.params.id;
        let name =req.params.name; 
        let searchResult = database[name].reminders.find(function (reminder) {
          return reminder.id == reminderToFind;
        });
        if (searchResult != undefined) {
          res.render("Social/single_friend_reminder", { reminderItem: searchResult });
        } else {
          res.render("Social/friend_reminders", { reminders: database[name].reminders });
        }
      },

    addReminder: async (req, res) => {
        let user = req.user.name
        let reminderName = req.body.reminderName
        let user_id = req.user.id;
        let weatherkey="f64eb826175eddf4f4465398309206bb"
        let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Vancouver&appid=${weatherkey}`)
        let parseweather=await weather.json()

        //adding friend's reminders to your database if they are not already there
        database[reminderName].reminders.forEach(reminder => {
            if (database[user].friendReminders.indexOf(reminder) == -1) {
                reminderAddName = reminder
                reminderAddName.name = reminderName
                database[user].friendReminders.push(reminderAddName)
            }
            if (database[user].friends.indexOf(reminderName) == -1) {
                database[user].friends.push(reminderName)
            }
        });

        res.render("reminder/index", { 
            reminders: database[user].reminders, 
            friendsReminders: database[user].friendReminders, 
            friendlist: database[user].friends,
            weatherdata:parseweather,
            Username: user,
        });
    }
};


module.exports = friendcontroller