<template>
  <v-form>
    <h1>Sign in</h1>
    <v-text-field v-model="email" color="red darken-3" label="E-mail" required></v-text-field>

    <v-text-field v-model="password" type='password' color="red darken-3" label="Password" required></v-text-field>

    <v-btn color="red darken-3" dark depressed @click="resetValidation">Sign in</v-btn>
    <v-btn depressed to="/signup">Create account</v-btn>
  </v-form>
</template>

<script>
export default {
  name: "signin"
};
</script>