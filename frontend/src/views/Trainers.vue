<template>
  <div id="trainerContainer">
    <div id="trainerHeader">
    </div>
    <div id="trainerBody">
      <router-view></router-view>    
    </div>
  </div>
  <!-- <div>
    {{fetchedTeams}}
  </div> -->
</template>

<script>
// @ is an alias to /src
export default {
  name: 'trainers',

  data() {
    return {
      fetchedTeams: []
    };
  },

  mounted() {
    this.fetchTeams();
    this.scroll();
    console.log(this.fetchedTeams)
  },

  methods: {
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
        this.fetchedTeams.find(team => team.name === data.name) === undefined
          ? false
          : true;
      if (!found) {
        let tempTeams = data.result;
        for (let tempTeam in tempTeams) {
          this.fetchedTeams.push(tempTeam);
        }
      }
    }
  }
}
</script>
