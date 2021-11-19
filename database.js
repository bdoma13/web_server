let Database = {
    cindy: {
        reminders: [
            {id: 1, title: "Test", description: "Test is good", completed: false, date: "2021-03-17T19:01", tag: ['test'], subtask: ['wake up at 7','77788','465132']},
            ],
        friendReminders: [],
        friends: []
    },
    alex: {
        reminders: [
            {id: 2, title: "alex Test", description: "Test is good", completed: false, date: "2022-04-17T12:01", tag: ['hi'], subtask: ['kjabv','SDF']},
            ],
        friendReminders: [],
        friends: []
    },
    jax: {

        reminders: [
            {id: 3, title: "jax Test", description: "Test is good", completed: false, date: "2021-03-17T13:51", tag: [], subtask: []},
            ],
        friendReminders: [],
        friends: []
    }
}

let Account=[
     {
        id: 1,
        name: "cindy",
        email: "cindy123@gmail.com",
        password: "cindy123!",
        friends:[],
    },
      
     {
        id: 2,
        name: "alex",
        email: "alex123@gmail.com",
        password: "alex123!",
        friends:[],
    },

     {
        id: 3,
        name: "jax",
        email: "jax123@gmail.com",
        password: "jax123!",
        friends:[],
    },
]

const userModel = {
findOne: (email) => {
    const user = Account.find((user) => user.email === email);
    if (user) {
    return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
},

findById: (id) => {
    const user = Account.find((user) => user.id === id);
    if (user) {
    return user;
    }
},
};


module.exports = {Database,Account,userModel};
