<template>
  <v-hover v-slot:default="{ hover }">
    <v-card ripple :elevation="hover ? 5 : 2" v-bind:id="team" class="px-4">
      <v-row>
        <v-col class="d-flex flex-column justify-space-between">
          <div class="caption grey--text">Trainer Name</div>
          <p class="title text-capitalize font-weight-medium no-underline">{{team}}</p>
        </v-col>
        <v-progress-circular
            :rotate="360"
            :size="70"
            :width="10"
            :value="team.length / 6 * 100"
            color="red darken-3"
            class="ma-3"
          >{{teamContent.length}} / 6</v-progress-circular>
      </v-row>
      <v-row>
        <v-col v-for="pokemon in teamContent" :key="pokemon.id">
          <p class="overline text-center pb-0 mb-0">{{pokemon.name}}</p>
          <div class="d-flex justify-center">
            <img v-bind:src="pokemon.sprites.front_default" width="96" height="96" />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>

<script>
// @ is an alias to /src

export default {
  name: "team",
  props: {
    team: String
  },
  data() {
    return {
      teamContent: [],
      user: null
    };
  },

  mounted() {
    this.getTeamInfo(this.team);
  },

  methods: {
    getTeamInfo: async function(team) {
      let response = await fetch(
        `http://localhost:3000/private/teams/${this.team}`,
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
            this.teamContent.push(result);
          });
        });
      }
      console.log(this.teamContent);
    }
  }
};
</script>