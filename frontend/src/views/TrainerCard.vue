<template>
  <v-hover v-slot:default="{ hover }">
    <v-card ripple :elevation="hover ? 5 : 2" class="pl-3" v-if="trainername != null">
      <v-row>
        <v-col>
          <div class="caption grey--text">Trainer Name</div>
          <div id="trainer">{{trainername}}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-progress-circular
            :rotate="360"
            :size="100"
            :width="15"
            :value="team.length / 6 * 100"
            color="red darken-3"
          >{{team.length}} / 6</v-progress-circular>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="pokemon in team" :key="pokemon.id">
          <span class="overline">{{pokemon.name}}</span>
          <br />
          <img v-bind:src="pokemon.sprites.front_default" />
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
      if (response['err'] === undefined) {
        response = response.result;
        response = await response.map(async (pokemon) => {
          let response = await fetch(`https://fizal.me/pokeapi/api/v2/name/${pokemon}.json`);
          return await response.json();
        });

        response.forEach(promise => {
          promise.then(result => {
            this.team.push(result)
          })
        })
      }
    }
  }
};
</script>