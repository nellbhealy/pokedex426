<template>
  <v-hover v-slot:default="{ hover }">
    <v-card ripple :elevation="hover ? 5 : 2" class="px-4" v-if="trainername != null">
      <v-row>
        <v-col>
          <div class="caption grey--text">Trainer Name</div>
          <p
            id="trainer"
            class="title text-capitalize font-weight-medium no-underline"
          >{{trainername}}</p>
        </v-col>
        <v-progress-circular
            :rotate="360"
            :size="70"
            :width="10"
            :value="team.length / 6 * 100"
            color="red darken-3"
            class="ma-3"
          >{{team.length}} / 6</v-progress-circular>
      </v-row>
      <v-row>
        <v-col>
          
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="pokemon in team" :key="pokemon.id">
          <p class="overline text-center mb-0">{{pokemon.name}}</p>
          <div class="d-flex justify-center">
            <img v-bind:src="pokemon.sprites.front_default" width="96" height="96" />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: "trainercard",
  data() {
    return {
      team: [],
      trainername: null
    };
  },

  mounted() {
    this.fetchTrainerInfo();
  },

  methods: {
    fetchTrainerInfo: async function() {
      // make backend call to get info of logged in user, if there is one
      this.trainername = sessionStorage.getItem("user");
      let response = await fetch(
        `http://localhost:3000/private/teams/${this.trainername}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
          }
        }
      );

      response = await response.json();
      if (response["err"] === undefined) {
        response = response.result;
        response = await response.map(async pokemon => {
          let response = await fetch(
            `https://fizal.me/pokeapi/api/v2/name/${pokemon}.json`
          );
          return await response.json();
        });

        response.forEach(promise => {
          promise.then(result => {
            this.team.push(result);
          });
        });
      }
    }
  }
};
</script>