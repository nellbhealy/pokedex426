<template>
  <div id="pokedexContainer">
    <div id="pokedexHeader">
    </div>
    <div id="pokedexBody">
      <router-view></router-view>    
    </div>
  </div>
</template>

<script>
export default {
  name: 'pokedex'
}
</script>

<style>
#pokedexHeader {
  background-image: url('../assets/pokedexHeader.svg');
  background-size: 100% 100%;
  background-position: top;
  width: 650px;
  height: 100px;
  position: fixed;
  top:0;
  margin-top: 0;
  padding-top: 0;
  z-index: 3;
}
  #pokedexBody {
    padding-top: 20vh;
    background-color: #C10000;
    min-height: 80vh;
    /* max-height: 80vh; */
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    scrollbar-width: none;
    padding-bottom: 5vh;
    margin-bottom: 1rem;
    margin-left: 25px;
  }
</style>