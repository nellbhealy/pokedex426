<template>
  <div>
    <!-- List of all Teams, which is dynamically fetched and rendered -->
    <Team
      :team="team"
      class="mt-2"
      v-for="team in fetchedTeams"
      :key="team">
    </Team>
  </div>
</template>

// Script is the 'controller' 
// Contains registration of components, js functions to control the view, etc.
<script>
// In order to use a component within a view, we need to (1) import it
import Team from "./Team";

export default {
  name: "teamList",
  // In order to use a component within a view, we need to (2) register it in the components object
  components: {
    Team
  },
  data() {
    return {
      search: null,
      fetchedTeams: [],
    };
  },

//   watch: {
//     search: async function(curr, old) {
//       if (curr != null) {
//         let pokemon = this.fetchedPokemon.find((element) => {console.log(element.name); return element.name === curr.toLowerCase()});
//         console.log(pokemon, curr.toLowerCase());
//         //if not in fetchedPokemon, fetch that particular pokemon now
//         if (pokemon === undefined) {
//           let response = await fetch(
//           `https://fizal.me/pokeapi/api/v2/name/${curr.toLowerCase()}.json`
//         );
//           pokemon = await response.json();
//         }
//         //redirect with that pokemon's info in the path parameters 
//         this.$router.push({name: 'details', params: {...pokemon}, id: pokemon.name})
//       }
//     }
//   },

  mounted() {
    this.fetchTeams();
    this.scroll();
  },

  methods: {
    //use for infinite scrolling
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop +
            window.innerHeight -
            document.documentElement.offsetHeight <
            100 &&
          document.documentElement.scrollTop +
            window.innerHeight -
            document.documentElement.offsetHeight >=
            -10;
        if (bottomOfWindow) {
          this.fetchTeams();
        }
      };
    },

    //get pokemon from API
    fetchTeams: async function() {
      let response = await fetch(`http://localhost:3000/private/teams`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
            }
          });
      let data = await response.json();
      let found =
        this.fetchedTeams.find(team => team.name === data.name) ===
        undefined
          ? false
          : true;
      if (!found) {
        let tempTeams = data.result;
        for(let tempTeam in tempTeams){
          this.fetchedTeams.push(tempTeam);
        }
      }
    }
  }
};
</script>