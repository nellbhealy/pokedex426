<template>
  <v-form ref="form" v-model="valid">
    <h1>Sign in</h1>
    <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      :type="'password'"
      label="Password"
      @keyup.enter="submitForm"
      required
    ></v-text-field>
    <v-btn color="red darken-3" dark depressed @click="submitForm">Sign in</v-btn>
    <v-btn depressed to="/signup">Create Account</v-btn>
  </v-form>
</template>

<script>
export default {
  name: "signin",
  data: () => ({
    name: "",
    valid: true,
    email: "",
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 10) || "Name must be less than 10 characters"
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 6) || "Password must have at least 6 characters"
    ]
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    submitForm() {
      let poster = async function(n, p, v) {
        let tempJwt;
        let result = await v.pubRoot
          .post("account/login", { name: n, pass: p })
          .catch(function(error) {
            console.log(error);
            return;
          });
        tempJwt = JSON.parse(JSON.stringify(result.data));
        sessionStorage.setItem("jwt", tempJwt.jwt);
        sessionStorage.setItem("user", tempJwt.name);
        v.$root.$children[0].user = tempJwt.name;
        v.$root.$children[0].header = "Hello ";
        v.$root.router.push("/trainercard");

      };
      poster(this.name, this.password, this);
    }
  }
};
</script>