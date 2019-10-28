<template>
  <v-form>
    <h1>Sign in</h1>
    <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

    <v-btn color="red darken-3" dark depressed @click="resetValidation">Sign in</v-btn>
    <router-link to="/signup">Don't have an account? Create one here.</router-link>
  </v-form>
</template>

<script>
export default {
  name: "signin"
};
</script>
