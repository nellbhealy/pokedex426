<template>
  <v-hover v-slot:default="{ hover }">
    <v-card ripple :elevation="hover ? 5 : 2" class='pl-3'>
      <v-row>
          <v-col>
            <div class="caption grey--text">Trainer Name</div>
            <div id="trainer">{{$root.user}}</div>
          </v-col>
          <v-col>
            <div class="caption grey--text">PERSON</div>
            <div>person</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for='n in 6' :key='n.id' height='100'>
            Pokemon {{n}}
          </v-col>
        </v-row>
    </v-card>
  </v-hover>
</template>

<script>

export default {
  name: "trainercard"
};



</script>

<style>
</style>
