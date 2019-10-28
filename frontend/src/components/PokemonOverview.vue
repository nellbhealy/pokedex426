<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      class="m-2 pb-4"
      ripple
      :elevation="hover ? 12 : 2"
      width="40vw"
      v-bind:id="pokemon.name"
    >
      <v-row>
        <v-col>
          <v-card-title>
        
            <router-link
              :to="{name: 'details', params: {...pokemon}, id: pokemon.name}"
              class='text-capitalize font-weight-bold black--text no-underline'
            >{{pokemon.name}}</router-link>
          <p class="caption grey--text">#00{{pokemon.id}}</p>

          </v-card-title>
          
          <br />
          <v-icon right>mdi-thumb-up-outline</v-icon>5
          <v-icon right>mdi-thumb-down-outline</v-icon>0
          <v-icon right>mdi-pokeball</v-icon>
        </v-col>
        <v-col>
          <img v-bind:src="pokemon.sprites.front_default" />
          <div>
              <span :class="type.type.name + ' type'" v-for="type in pokemon.types" :key="type.id">{{type['type']['name']}}</span>
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
  }
};
</script>
<style>
.no-underline {
    text-decoration: none;
}

.type {
    padding: 5px 25px 7px;
    border-radius: 15px;
    margin: 5px;
    text-align: center;
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