<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <h1>Sign in</h1>

    <v-text-field 
      v-model="email"
      :rules="emailRules" 
      label="E-mail" 
      required
      ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      :type="'password'"
      label="Password"
      required
    ></v-text-field>

    <v-btn color="red darken-3" dark depressed @click="resetValidation">Sign in</v-btn>
    <router-link to="/signup">Don't have an account? Create one here.</router-link>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    name: "signin",
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    password: '',
    passwordRules: [
      v => !!v || "Password is required", 
      v => (v && v.length >= 6) || "Password must be at least 6 characters"
      ],
  }),
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  }
};
</script>
