//GET STATE FROM SESSION STORAGE 
let saved_state = sessionStorage.getItem('state');
saved_state = saved_state && JSON.parse(saved_state);

//...OR SET INITIAL STATE
let state = saved_state || {
    auth: {},
    users: [],
    active_tab: 0,
    tabs: [
        {
            name: 'О ПРОЕКТЕ',
            cmp: 'about'
        },
        {
            name: 'ПОЛЬЗОВАТЕЛИ',
            cmp: 'unauthenticate'
        },
    ]
};

//MOCK DATA
axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        let promise = void 0;

        if(error.config.url.indexOf('signin') !== -1) {
            //SAMPLE DATA ON SIGN IN
            promise = Promise.resolve({
                data: {
                    auth: {
                        name: 'joe doe',
                        email: 'j.doe@ex.com'
                    },
                    users: [
                        {
                            name: 'joe doe',
                            email: 'j.doe@ex.com'
                        },
                        {
                            name: 'will smith',
                            email: 'w.smith@ex.com'
                        }
        
                    ],
                    tabs: [
                        {
                            name: 'О ПРОЕКТЕ',
                            cmp: 'about'
                        },
                        {
                            name: 'ПОЛЬЗОВАТЕЛИ',
                            cmp: 'users'
                        },
                        {
                            name: 'СЕКРЕТНАЯ ЧАСТЬ',
                            cmp: 'secret'
                        }
                    ]
                },
                status: 200
            });
        }

        if(error.config.url.indexOf('signout') !== -1) {
            //INITIAL STATE ON SIGN OUT
            promise = Promise.resolve({
                data: {
                    auth: {},
                    users: [],
                    tabs: [
                        {
                            name: 'О ПРОЕКТЕ',
                            cmp: 'about'
                        },
                        {
                            name: 'ПОЛЬЗОВАТЕЛИ',
                            cmp: 'unauthenticate'
                        },
                    ]
                },
                status: 200
            });
        }

        return promise;
    }
);

//COMPONENTS
let about = {
    template: '#about',
}

let secret = {
    template: '#secret',
}

let unauthenticate = {
    template: '#unauthenticate',
}

let users = {
    template: '#users',
    props: ['state'],
    data: () => {
        return {
            headers: [
                {
                    text: 'user name',
                    value: 'name'
                },
                {
                    text: 'email',
                    value: 'email'
                }
            ]
        }
    }
}

let signin = {
    template: '#signin',
    props: ['visible'],
    data: () => {
        return {
            email: 'user@example.com',
            password: '123'
        }
    },
    methods: {
        submit() {
            this.$refs.form.validate() && this.$emit('submit', this.email, this.password);
        }
    }
}

//VUE INSTANCE
new Vue({
    el: '#app',
    components: {
        'about': about,
        'secret': secret,
        'unauthenticate': unauthenticate,
        'users': users,
        'signin': signin,
    },
    data() {
        return {
            state: {...state}, //MAKE SAVED STATE REACTIVE
            header: 'Vue.js app',
            icon: 'fa-ship',
            dialogs: {
                signin: false,
                signout: false //CONFIRM DIALOG. NOT IMPLEMENTED YET
            }
        
        };

    },
    methods: {
        async signin(email, password) {
            //REQUEST SIGNIN
            let res = await axios(`https://localhost:0/signin?email=${email}&password=${password}`); 

            //JOIN CURRENT STATE & RESPONSE DATA
            Object.assign(this.state, res.data);
            //SAVE STATE IN SESSION STORAGE
            this.state && sessionStorage.setItem('state', JSON.stringify(this.state));
            
            this.dialogs.signin = false;
        },
        async signout() {
            //REQUEST SIGNOUT
            let res = await axios('https://localhost:0/signout');

            //JOIN CURRENT STATE & RESPONSE DATA
            Object.assign(this.state, res.data);
            //SAVE STATE IN SESSION STORAGE
            this.state && sessionStorage.setItem('state', JSON.stringify(this.state));

            //CHECK CURRENT TAB DISSAPEARED & ACTIVATE NEAREST
            this.state.active_tab > this.state.tabs.length - 1 && (this.state.active_tab = this.state.tabs.length - 1 + '');
        }
    },
    created() {
        document.title = this.header;
    },
    computed: {
        active() {
            //GET COMPONENT NAME FROM ACTIVE TAB TO SHOW
            return this.state.tabs[this.state.active_tab].cmp;
        }
    },
    watch: {
        'state.active_tab': function(val) {
            //SAVE STATE IN SESSION STORAGE
            this.state && sessionStorage.setItem('state', JSON.stringify(this.state));
        }
    }
});
