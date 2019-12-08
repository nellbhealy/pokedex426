<template>
  <v-hover v-slot:default="{ hover }">
    <v-card ripple :elevation="hover ? 5 : 2" v-bind:id="team">
      <v-row>
        <v-col class="d-flex flex-column justify-space-between">
          <div class="ps-3">
            <p class="title text-capitalize font-weight-medium no-underline"
            >{{team}}</p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="caption grey--text">Trainer Name</div>
          <div id="trainer">{{team}}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="pokemon in teamContent" :key="pokemon.id">
          <span class="overline">{{pokemon.name}}</span>
          <br />
          <img v-bind:src="pokemon.sprites.front_default" />
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'team',
  props: {
    team: String,
  },
  data() {
      return {
          teamContent: [],
          user: null,
      };
  },

  mounted() {
      this.getTeamInfo(this.team);
  },

  methods: {
    getTeamInfo: async function(team){
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
        if (response['err'] === undefined) {
            response = response.result;
            response = await response.map(async (pokemon) => {
                let response = await fetch(`https://fizal.me/pokeapi/api/v2/name/${pokemon}.json`);
                return await response.json();
            });

            response.forEach(promise => {
                promise.then(result => {
                    this.teamContent.push(result)
                })
            });
        }
        console.log(this.teamContent);
    }
  }
}
</script>