const emojis = require('../../public/emojis.data.json');

module.exports = {
    id: {
        path: "id",
        type: "string",
        regex: /^[a-fA-F0-9]{24}$/, // assumed that all ids will be an ObjectID as the default in mongoDB
    },
    username: {
        path: 'username',
        type: 'string',
        length: {min: 3, max: 20},
        custom: 'username',
    },
    password: {
        path: 'password',
        type: 'string',
        length: {min: 8, max: 100},
    },
    role: {
        path: 'role',
        type: 'string',
        oneOf: ["admin", "superadmin"],
    },
    school: {
        path: 'school',
        type: 'string',
        regex: /^[a-fA-F0-9]{24}$/,
    },
    schoolId: {
        path: 'schoolId',
        type: 'string',
        regex: /^[a-fA-F0-9]{24}$/,
    },
    classroom: {
        path: 'classroom',
        type: 'string',
        regex: /^[a-fA-F0-9]{24}$/,
    },
    classroomId: {
        path: 'classroomId',
        type: 'string',
        regex: /^[a-fA-F0-9]{24}$/,
    },
    title: {
        path: 'title',
        type: 'string',
        length: {min: 3, max: 300}
    },
    label: {
        path: 'label',
        type: 'string',
        length: {min: 3, max: 100}
    },
    shortDesc: {
        path: 'desc',
        type: 'string',
        length: {min:3, max: 300}
    },
    longDesc: {
        path: 'desc',
        type: 'string',
        length: {min:3, max: 2000}
    },
    url: {
        path: 'url',
        type: 'string',
        length: {min: 9, max: 300},
    },
    emoji: {
        path: 'emoji',
        type: 'Array',
        items: {
            type: 'string',
            length: {min: 1, max: 10},
            oneOf: emojis.value,
        }
    },
    price: {
        path: 'price',
        type: 'number',
    },
    avatar: {
        path: 'avatar',
        type: 'string',
        length: {min: 8, max: 100},
    },
    text: {
        type: 'String',
        length: {min: 3, max:15},
    },
    longText: {
        type: 'String',
        length: {min: 3, max:250},
    },
    paragraph: {
        type: 'String',
        length: {min: 3, max:10000},
    },
    phone: {
        path: 'phone',
        type: 'String',
        length: {min: 3}
    },
    name: {
        path: 'name',
        type: 'String',
        length: {min:3, max: 100}
    },
    firstName: {
        path: 'firstName',
        type: 'String',
        length: {min:3, max: 100}
    },
    lastName: {
        path: 'lastName',
        type: 'String',
        length: {min:3, max: 100}
    },
    address: {
        path: 'address',
        type: 'String',
        length: {min:3, max: 150}
    },
    website: {
        path: 'website',
        type: 'String',
        length: {min:3, max: 150}
    },
    type: {
        path: 'type',
        type: 'String',
        length: {min:6, max: 7}
    },
    email: {
        path: 'email',
        type: 'String',
        regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    number: {
        type: 'Number',
        length: {min: 1, max:6},
    },
    arrayOfStrings: {
        type: 'Array',
        items: {
            type: 'String',
            length: { min: 3, max: 100}
        }
    },
    obj: {
        type: 'Object',
    },
    bool: {
        type: 'Boolean',
    },
    page: {
        type: 'Number',
        length: {min: 1},
    },
    limit: {
        type: 'Number',
        length: {min: 1},
    },
    search: {
        path: "search",
        type: 'String',
        length: {min: 3, max:50},
    },
    capacity: {
        path: "capacity",
        type: 'Number',
        length: {min: 1},
    },
    resources: {
        path: 'resources',
        type: 'Array',
        items: {
            type: 'String',
            length: { min: 3, max: 50 }
        }
    },
    dateOfBirth:{
        path: "dateOfBirth",
        type: "string"
    }
}