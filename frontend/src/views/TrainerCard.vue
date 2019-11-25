<template>
  <v-hover v-slot:default="{ hover }">
    <v-card ripple :elevation="hover ? 5 : 2" class='pl-3' v-if="trainername != null">
      <v-row>
          <v-col>
            <div class="caption grey--text">Trainer Name</div>
            <div id="trainer">{{trainername}}</div>
          </v-col>
        </v-row>
        <v-row>
        <v-col>
          <v-progress-circular :rotate="360" :size="100" :width="15" :value="team.length / 6 * 100" color="red darken-3">{{team.length}} / 6</v-progress-circular>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="n in 6" :key="n.id">
          <span class="overline">Name</span>
          Pokemon {{n}}
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
      team: [1, 2, 3, 5, 3, 5],
      trainername: null
    };
  },

  mounted() {
    this.fetchTrainerInfo();
  },

  methods: {
    fetchTrainerInfo: async function() {
      // make backend call to get info of logged in user, if there is one
      this.trainername = sessionStorage.getItem('user');
    }
  }
};
</script>