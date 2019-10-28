<template>
  <div>
    <div class="details">
      <router-link to="/">x</router-link>
                <img v-bind:src="$route.params.sprites.front_default" />
    <h1 class='text-capitalize font-weight-bold black--text no-underline'>
      {{$route.params.name}}

    </h1>
       <div>
              <span :class="type.type.name + ' type'" v-for="type in $route.params.types" :key="type.id">{{type['type']['name']}}</span>
          </div>
        <h2>Abilities</h2>
      <span v-for="ability in $route.params.abilities"
        :key="ability.id">{{ability.ability.name}} </span>
    </div>
  </div>
</template>
<script>
export default {
  name: "PokemonDetails",
  mounted() {
    window.scrollTo(0, 0);
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
</style>