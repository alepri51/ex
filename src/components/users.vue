<template>
    <v-container>
        <v-layout fill-height column align-center>
            <v-icon color="green darken-2" class="shadow ma-2">fas fa-users fa-2x</v-icon>
            <b>ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ</b>
            <v-data-table class="green--text green--darken-2"
                            item-key="id"
                            disable-initial-sort
    
                            :headers="headers"
                            :items="state.users"
                            >
    
                <template slot="items" slot-scope="props">
                    <td>{{props.item.name}}</td>
                    <td>{{props.item.email}}</td>
                    <td class="justify-center layout px-0">
                        <v-btn icon @click="editAction(props.item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon @click="deleteAction(props.item)">
                            <v-icon color="red darken-2">delete</v-icon>
                        </v-btn>
                    </td>
                </template>
            </v-data-table>

        </v-layout>
    </v-container>
</template>

<script>
export default {
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
                },
                {
                    text: 'actions'
                }
            ]
        }
    },
    methods: {
        editAction(user) {
            alert(JSON.stringify(user));
        },
        deleteAction(user) {
            alert(JSON.stringify(user));
        }
    }
}    
</script>