<template>
    <v-container>
        <v-layout fill-height column align-center justify-center>
            <v-icon color="green darken-2" class="shadow ma-2">fas fa-users fa-2x</v-icon>
            <b>ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ</b>
            <span>Не осуществлен вход в ситему</span>
            <v-btn color="green darken-2" flat="flat" @click="signin">ВОЙТИ</v-btn>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    methods: {
        signin() {
            //dirty hack, should use event bus instead
            this.$parent.$parent.$parent.dialogs.signin = true;
        }
    }
}    
</script>