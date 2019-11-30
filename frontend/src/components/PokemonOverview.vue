<template>
  <v-hover v-slot:default="{ hover }">
    <v-card :elevation="hover ? 12 : 0" width="40vw" v-bind:id="pokemon.name">
      <v-row>
        <v-col class="d-flex flex-column justify-space-between">
          <div class="ps-3">
            <router-link
              :to="{name: 'details', params: {...pokemon}, id: pokemon.name}"
              class="title text-capitalize font-weight-medium no-underline link"
            >{{pokemon.name}}</router-link>
            <p class="overline grey--text">#{{pokemon.id.toString().padStart(3, "0")}}</p>
          </div>
          <div class="ms-2">
            <v-btn text icon @click="handleLike()">
              <v-icon
                :color="isLiked ?
               'green': 'gray'"
              >mdi-thumb-up{{isLiked ? '': '-outline'}}</v-icon>
            </v-btn>
            <span>{{numLikes}}</span>
            <v-btn text icon @click="handleDislike()" class="ml-2">
              <v-icon :color="isDisliked ?
               'red': 'gray'">
                mdi-thumb-down{{isDisliked ?
                '': '-outline'}}
              </v-icon>
            </v-btn>
            <span>{{numDislikes}}</span>
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
        </v-col>
        <v-col class="d-flex flex-column justify-center align-center">
          <img v-bind:src="pokemon.sprites.front_default" />
          <div>
            <span
              :class="type.type.name + ' caption type text-uppercase font-weight-light'"
              v-for="type in pokemon.types"
              :key="type.id"
            >{{type['type']['name']}}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>
<script>
export default {
  name: "PokemonOverview",
  props: {
    pokemon: Object
  },
  data() {
    return {
      numLikes: 0,
      numDislikes: 0,
      isLiked: false,
      isDisliked: false,
      isOnTeam: false,
      user: null
    };
  },

  mounted() {
    this.getBackendInfo(this.pokemon.name);
  },

  methods: {
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

      // if user is logged in, fetch their data and override session values
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
        if (team["err"] === undefined) {
          this.isOnTeam = team.result.find(name => name === pokemon);
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
.no-underline {
  text-decoration: none;
}

.link {
  color: black !important;
}

.link:hover {
  color: #c10000 !important;
  transition: 0.3s all;
}

.type {
  padding: 5px 25px 6px;
  border-radius: 15px;
  margin: 5px;
  text-align: center;
  box-shadow: 0px 1px 4px 1px lightgray;
}

.grass {
  background-color: greenyellow;
}

.poison {
  background-color: purple;
  color: white;
}

.fire {
  background-color: orangered;
  color: white;
}

.flying {
  background-color: azure;
}

.water {
  background-color: turquoise;
  color: white;
}

.bug {
  background-color: goldenrod;
}

.normal {
  background-color: antiquewhite;
}

.electric {
  background-color: gold;
}

.ground {
  background-color: tan;
}

.fairy {
  background-color: pink;
}

.fighting {
  background-color: maroon;
  color: white;
}

.psychic {
  background-color: palevioletred;
  color: white;
}

.rock {
  background-color: brown;
  color: white;
}

.steel {
  background-color: silver;
}

.ice {
  background-color: lightblue;
}

.ghost {
  background-color: darkorchid;
  color: white;
}

.dragon {
  background-color: deeppink;
}

.dark {
  background-color: darkslateblue;
  color: white;
}
</style>