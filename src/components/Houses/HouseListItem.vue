<template>
  <div class="card" @click="handleClick">
    <div class="card-content background2">
      <div class="button-container" v-if="house.madeByMe">
        <a href="#" @click.prevent.stop="editHouse" class="">
          <img src="/ic_edit_white@3x.png" class="primaryElement" alt="Edit" height="20" />
        </a>
        <a href="#" @click.prevent.stop="showDialog" class="">
          <img src="/ic_delete@3x.png" alt="Delete" height="20" />
        </a>
      </div>
      <div class="">
        <img class="image" :src="house.image" alt="House" />
      </div>
      <div class="location">
        <h1>{{ house.location.street }} {{ house.location.houseNumber }}</h1>
        <h2>
          <small>€{{ house.price }}</small>
        </h2>
      </div>
      <div class="zip-city secondaryText">
        <p class="" secondaryText>{{ house.location.zip }} {{ house.location.city }}</p>
      </div>
      <div class="bed-icon">
        <p>
          <img src="/ic_bed@3x.png" alt="bed icon" height="15" />
          {{ house.rooms.bedrooms }}
          <img src="/ic_bath@3x.png" alt="bath icon" height="15" />
          {{ house.rooms.bathrooms }}
          <img src="/ic_size@3x.png" alt="size icon" height="15" /> {{ house.size }} m²
        </p>
      </div>
      <div class="favorite-container">
        <button
          class="button button-confirm"
          v-if="!isFavorite"
          @click.prevent.stop="favorite"
        >
          Favorite
        </button>
        <button class="button button-warning" v-else @click.prevent.stop="favorite">
          Unfavorite
        </button>
      </div>
    </div>
  </div>
  <div class="dialog-backdrop" v-if="visable">
    <div class="dialog">
      <p>Are you sure you want to delete this house?</p>
      <button class="button button-warning" @click="deleteHouse">Yes</button>
      <button class="button button-confirm" @click="visable = false">No</button>
    </div>
  </div>
</template>

<script>
import { houseStore } from "../../stores/houseStore";
export default {
  name: "HouseListItem",
  props: {
    house: Object,
  },
  data() {
    return {
      visable: false,
      isFavorite: false,
    };
  },
  setup() {
    const store = houseStore();
    return { store };
  },
  mounted() { //check if the house is in the favorite list and set the isFavorite to true or false
    this.isFavorite = this.store.favoriteHouses.some(
      (favoriteHouse) => favoriteHouse.id === this.house.id
    );
  },
  emits: ["delete"],
  methods: {
    handleClick() { //go to the view house
      this.$router.push("/houses/" + this.house.id);
    },
    editHouse() { //go to the edit house 
      this.$router.push("/houses/" + this.house.id + "/edit");
    },
    showDialog() { //show the delete dialog
      this.visable = true;
    },
    deleteHouse() { //emit the delete event
      this.$emit("delete", this.house.id);
    },
    favorite() { //add or remove the house from the favorite list
      this.isFavorite = this.store.favoriteHouse(this.house);
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out;
  position: relative;
  margin-bottom: 10px;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card-content {
  padding: 16px;
}

.location,
.zip-city,
.bed-icon {
  margin-left: 260px;
}

.bed-icon img {
  vertical-align: middle;
}

.image {
  position: absolute;
  top: 10;
  right: 10;
  border-radius: 5%;
  height: 200px;
  width: 250px;
}
</style>
