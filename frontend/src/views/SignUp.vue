<template>
  <v-form>
  <h1>Sign up</h1>
  <v-text-field
      v-model="name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :type="'password'"
      label="Password"
      required
    ></v-text-field>

    <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validate
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Reset Form
    </v-btn>

    <v-btn
      color="red darken-3"
      dark 
      depressed
      @click="resetValidation"
    >
      Sign up
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: "signup",
  data: () => ({
    name: '',
    valid: true,
    nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    password: '',
    passwordRules: [v => !!v || "Password is required", v => (v && v.length <= 10)],
    checkbox: false,
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
  },
};
</script>
