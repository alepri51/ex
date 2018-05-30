<template>
  <v-app>
    <v-content>
      <v-toolbar color="green darken-2" dark dense>
        <v-toolbar-title class="mr-2">
          <v-icon class="mr-1 mb-1">{{icon}}</v-icon>
          <span>{{header}}</span>
        </v-toolbar-title>


        <v-tabs v-model="state.active_tab" color="green darken-2">

          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab v-for="tab in state.tabs" :key="tab.name">
            <v-icon class="mr-1 mb-1">{{ tab.icon}}</v-icon>
            {{ tab.name }}
          </v-tab>

        </v-tabs>

        <v-spacer></v-spacer>

        <v-toolbar-items >
          <v-btn v-if="!state.auth.name" flat @click="dialogs.signin = true">
            <v-icon class="mr-1 mb-1">fas fa-sign-in-alt</v-icon>вход
          </v-btn>

          <v-btn v-if="state.auth.name" flat>
            <v-icon class="mr-1 mb-1">fas fa-user-circle</v-icon>{{state.auth.name}}
          </v-btn>

          <v-btn v-if="state.auth.name"  flat @click="signout(true)">
            <v-icon class="mr-1 mb-1">fas fa-sign-out-alt</v-icon>
          </v-btn>

        </v-toolbar-items>

      </v-toolbar>

      <keep-alive>
        <component :is="active" :state="state"></component>
      </keep-alive>

      <signin :visible="dialogs.signin" @cancel="dialogs.signin = false" @submit="signin"></signin>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'

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

export default {
    props: {
        msg: String
    },
    components: {
        about: () => import('./about.vue'),
        signin: () => import('./signin.vue'),
        secret: () => import('./secret.vue'),
        unauthenticate: () => import('./unauthenticate.vue'),
        users: () => import('./users.vue')
    },
    data() {
        return {
            state: {...state}, //COPY state
            header: 'Vue.js app',
            icon: 'fa-ship',
            dialogs: {
                signin: false,
                signout: false //CONFIRM DIALOG. NOT IMPLEMENTED YET
            }
        
        };

    },
    methods: {
        async $request(url) {
            let res = await axios(url); 

            //JOIN CURRENT STATE & RESPONSE DATA
            Object.assign(this.state, res.data);
            
            //SAVE STATE IN SESSION STORAGE
            this.state && sessionStorage.setItem('state', JSON.stringify(this.state));
        },
        async signin(email, password) {
            //REQUEST SIGNIN
            this.$request(`https://localhost:0/signin?email=${email}&password=${password}`);
            
            this.dialogs.signin = false;
        },
        async signout() {
            //REQUEST SIGNOUT
            this.$request(`https://localhost:0/signout`);

            //CHECK CURRENT TAB DISSAPEARED & ACTIVATE NEAREST
            this.state.active_tab > this.state.tabs.length - 1 && (this.state.active_tab = this.state.tabs.length - 1 + '');
        }
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .container {
        height: calc(100% - 48px);
    }

    .toolbar .tabs {
        width: auto;
    }    
</style>
