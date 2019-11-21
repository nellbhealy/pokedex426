<template>
  <v-app background-color="transparent">
    <v-container>
      <v-row>
        <!--Spacer for the navigation menu-->
        <v-col cols='4'>
          <p id="greeting" class="overline" color="red darken-3">{{$root.header}}{{$root.user}}!</p>
          <v-btn outlined color="red darken-3" class="mt-4" to="/signin">Sign in</v-btn>
          <nav>
            <v-tabs :vertical="true" color="red darken-3" background-color="transparent">
              <v-tab key="pokedex" to="/pokedex">Pokedex</v-tab>
              <v-tab key="teams" to="/teams">Browse Teams</v-tab>
              <v-tab id="tCard" :style="{'--show-card': $root.showCard }" key="mytrainercard" to="/trainercard">Trainer Card</v-tab>
            </v-tabs>
          </nav>
        </v-col>
        <!--Actual content-->
        <v-col cols='8'>
          <v-content>
            <router-view />
          </v-content>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
   
    }
  }
};
</script>

<style>
/* Override the vuetify background */
.theme--light.v-application {
  background-color: transparent !important;
}

/* Adds the pokeball on the left side */
body {
  background-image: url("assets/pokeball.svg");
  background-attachment: fixed;
  background-size: 75% 75%;
  background-position: -100%;
  background-color: #fafafa;
}

/* Hides trainer card tab if not logged in */
#tCard {
  display: var(--show-card);
}
/* Puts the navigation tabs on the left center of the screen */
nav {
  position: fixed;
  top: 40vh;
}
/* Styles the scrollbar */
::-webkit-scrollbar {
    width: 12px;
}
 
::-webkit-scrollbar-track {
    background-color: #fafafa;
}
 
::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(214, 214, 214, 0.8); 
}
</style>