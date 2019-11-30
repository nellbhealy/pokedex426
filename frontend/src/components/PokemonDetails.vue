<template>
  <div class="details pb-4">
    <!-- Buttons at top of details screen -->
    <div class="d-flex justify-space-between">
      <router-link to="/" class="no-underline ma-3">
        <v-btn icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </router-link>
      <div class="ma-3">
        <v-btn text icon @click="handleLike()">
          <v-icon
            :color="isLiked ?
               'green': 'gray'"
          >mdi-thumb-up{{isLiked ? '': '-outline'}}</v-icon>
        </v-btn>
        <span>{{numLikes}}</span>

        <!-- Dislike button -->
        <v-btn text icon @click="handleDislike()" class="ml-2">
          <v-icon :color="isDisliked ?
               'red': 'gray'">
            mdi-thumb-down{{isDisliked ?
            '': '-outline'}}
          </v-icon>
        </v-btn>
        <span>{{numDislikes}}</span>

        <!-- Team button -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              icon
              class="ml-2"
              @click="handleTeamButton()"
              v-on="on"
              :disabled="user === null ? true : false"
            >
              <v-icon :color="isOnTeam ?
               'red': 'gray'">mdi-pokeball</v-icon>
            </v-btn>
          </template>
          <span>Add or remove from your team</span>
        </v-tooltip>
      </div>
    </div>

    <!-- Content of details screen -->
    <div class="d-flex flex-column align-center pa-2">
      <!-- Image, Pokedex number, height, weight -->
      <img v-bind:src="pokemon.sprites.front_default" />
      <p
        class="overline grey--text ma-0"
      >#{{pokemon.id.toString().padStart(3, "0")}} - {{(pokemon.height * 3.937).toFixed(2)}}in - {{(pokemon.weight / 45.39).toFixed(2)}}lbs</p>
      <h1 class="text-capitalize font-weight-bold black--text no-underline">{{pokemon.name}}</h1>

      <!-- Name and types -->
      <div>
        <span
          :class="type.type.name + ' caption type text-uppercase font-weight-light'"
          v-for="type in pokemon.types"
          :key="type.id"
        >{{type['type']['name']}}</span>
      </div>

      <!-- Abilities -->
      <h2 class="my-4">Abilities</h2>
      <div>
        <span
          class="type caption text-uppercase"
          v-for="ability in pokemon.abilities"
          :key="ability.id"
        >{{ability.ability.name}}</span>
      </div>

      <!-- Stats -->
      <h2 class="my-4">Stats</h2>
      <span class="mb-2 text-uppercase caption stat" v-for="stat in pokemon.stats" :key="stat.id">
        {{stat.stat.name}}
        <v-progress-linear
          rounded
          height="25px"
          :value="stat.base_stat/260 * 100"
        >{{stat.base_stat}}</v-progress-linear>
      </span>

      <!-- Moves -->
      <h2>Moves</h2>
      <div class="d-flex flex-row flex-wrap justify-center">
        <span
          v-for="move in pokemon.moves"
          :key="move.id"
          class="text-capitalize"
        >{{move.move.name + ',&nbsp;'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PokemonDetails",
  data() {
    return {
      numLikes: 0,
      numDislikes: 0,
      isLiked: false,
      isDisliked: false,
      isOnTeam: false,
      pokemon: null,
      user: null
    };
  },
  mounted: async function() {
    window.scrollTo(0, 0);
    this.pokemon = this.$route.params;
    if (this.pokemon.height === undefined) {
      this.getPokemon(this.pokemon.name);
    }
    this.getBackendInfo(this.pokemon.name);
  },

  methods: {
    getPokemon: async function(pokemon) {
      console.log("go")
      let response = await fetch(
        `https://fizal.me/pokeapi/api/v2/name/${pokemon.toLowerCase()}.json`
      );

      this.pokemon = await response.json();
    },

    getBackendInfo: async function(pokemon) {
      let pokemonInfo = await fetch(
        `http://localhost:3000/public/pokemon/${pokemon}`
      );
      pokemonInfo = await pokemonInfo.json();
      if (pokemonInfo["err"] === undefined) {
        this.numLikes =
          pokemonInfo.result.likes === undefined ? 0 : pokemonInfo.result.likes;
        this.numDislikes =
          pokemonInfo.result.dislikes === undefined
            ? 0
            : pokemonInfo.result.dislikes;
      }

      if (sessionStorage.getItem(`[${pokemon}][like]`) === null) {
        this.isLiked = false;
      } else {
        this.isLiked =
          sessionStorage.getItem(`[${pokemon}][like]`).toString() === "true"
            ? true
            : false;
      }

      if (sessionStorage.getItem(`[${pokemon}][dislike]`) === null) {
        this.isDisliked = false;
      } else {
        this.isDisliked =
          sessionStorage.getItem(`[${pokemon}][dislike]`).toString() === "true"
            ? true
            : false;
      }

      this.user = sessionStorage.getItem("user");
      if (this.user != null) {
        let team = await fetch(
          `http://localhost:3000/private/teams/${this.user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            }
          }
        );

        team = await team.json();
        if (team['err'] === undefined) {
          this.isOnTeam = team.result.find((name) => name === pokemon);
        }
      }
    },

    handleLike: async function() {
      this.isLiked = !this.isLiked;
      this.numLikes = this.isLiked ? this.numLikes + 1 : this.numLikes - 1;
      //update like count in backend pokemon/name
      await fetch(
        `http://localhost:3000/public/pokemon/${this.pokemon.name}/likes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: `{"data": ${this.numLikes}}`
        }
      );

      // if not logged in, go to session storage
      sessionStorage.setItem(`[${this.pokemon.name}][like]`, this.isLiked);
      // otherwise, set in backend
      if (this.user != null) {
        if (this.isLiked) {
          console.log("Bearer", sessionStorage.getItem("jwt"));
          await fetch(`http://localhost:3000/user/likes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: `{"data": ["${this.pokemon.name}"], "type": "merge"}`
          });
        } else {
          // get array of likes
          let likes = await fetch(`http://localhost:3000/user/likes`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            }
          });

          likes = await likes.json();
          if (likes["err"] === undefined) {
            likes = likes.result;
          } else {
            likes = [];
          }
          // update pokemon in array of likes
          if (this.isLiked == false) {
            likes = likes.filter(name => name != this.pokemon.name);
            await fetch(`http://localhost:3000/user/likes`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
              },
              body: `{"data": ${JSON.stringify(likes)}}`
            });
          }
          await fetch(`http://localhost:3000/user/likes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: `{"data": ["${this.pokemon.name}"], "type": "merge"}`
          });
        }
      }
    },

    handleDislike: async function() {
      this.isDisliked = !this.isDisliked;
      this.numDislikes = this.isDisliked ? this.numDislikes + 1 : this.numDislikes - 1;
      //update like count in backend pokemon/name
      await fetch(
        `http://localhost:3000/public/pokemon/${this.pokemon.name}/dislikes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: `{"data": ${this.numDislikes}}`
        }
      );

      // if not logged in, go to session storage
      sessionStorage.setItem(`[${this.pokemon.name}][dislike]`, this.isDisliked);
      // otherwise, set in backend
      if (this.user != null) {
        if (this.isDisliked) {
          console.log("Bearer", sessionStorage.getItem("jwt"));
          await fetch(`http://localhost:3000/user/dislikes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: `{"data": ["${this.pokemon.name}"], "type": "merge"}`
          });
        } else {
          // get array of dislikes
          let dislikes = await fetch(`http://localhost:3000/user/dislikes`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            }
          });

          dislikes = await dislikes.json();
          if (dislikes["err"] === undefined) {
            dislikes = dislikes.result;
          } else {
            dislikes = [];
          }
          // update pokemon in array of likes
          if (this.isDisliked == false) {
            dislikes = dislikes.filter(name => name != this.pokemon.name);
            await fetch(`http://localhost:3000/user/dislikes`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
              },
              body: `{"data": ${JSON.stringify(dislikes)}}`
            });
          }
          await fetch(`http://localhost:3000/user/dislikes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: `{"data": ["${this.pokemon.name}"], "type": "merge"}`
          });
        }
      }
    },

    handleTeamButton: async function() {
      let team = await fetch(
        `http://localhost:3000/private/teams/${this.user}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
          }
        }
      );

      team = await team.json();
      if (team["err"] === undefined) {
        team = team.result;
      } else {
        team = [];
      }
      if (!this.isOnTeam == false) {
        this.isOnTeam = !this.isOnTeam;
        team = team.filter(name => name != this.pokemon.name);
        // console.log(JSON.stringify(team))
        await fetch(`http://localhost:3000/private/teams/${this.user}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
          },
          body: `{"data": ${JSON.stringify(team)}}`
        });
      } else {
        // check if team size is < 6
        if (team.length < 6) {
          this.isOnTeam = !this.isOnTeam;

          // update team in backend/user/team
          await fetch(`http://localhost:3000/private/teams/${this.user}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: `{"data": ["${this.pokemon.name}"], "type": "merge"}`
          });
        } else {
          console.log("team size =6");
        }
      }
    }
  }
};
</script>
<style>
.details {
  background-color: white;
  min-height: 100vh;
  width: 40vw;
  /* box-shadow: 0px 3px 3px 1px #9B0000; */
  border-radius: 0.5rem;
}

.stat {
  width: 70%;
}
</style>