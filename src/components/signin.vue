<template>
    <v-dialog v-model="visible" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <v-icon class="mr-1 green--text text--darken-2">fas fa-user-circle</v-icon>
                <span class="headline green--text text--darken-2">sign in</span>
            </v-card-title>
            <v-card-text>
                <v-card-text>
                    <v-form ref="form" class="form" lazy-validation @submit.prevent>
                        <v-text-field v-model="email"
                                        label="Email"
                                        required
                                        prepend-icon="fas fa-at"
                                        autofocus
                                        color="green darken-2"
                                        :rules="[
                                            () => !!email || 'This field is required',
                                        ]"
                        ></v-text-field>
                        <v-text-field v-model="password"
                                        label="Password"
                                        type="password"
                                        required
                                        prepend-icon="fas fa-key"
                                        color="green darken-2"
                                        :rules="[
                                            () => !!password || 'This field is required',
                                        ]"
                        ></v-text-field>
                    </v-form>
                    <small>*indicates required field</small>
                </v-card-text>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-2" flat @click.native="$emit('cancel')">cancel</v-btn>
                <v-btn color="green darken-2" flat @click.native="submit">sign in</v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>
</template>

<script>
export default {
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
</script>