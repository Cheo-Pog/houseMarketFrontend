<template>
  <section>
    <div class="container">
      <p>
        <img
          src="/ic_back_grey@3x.png"
          class="button"
          height="10"
          @click="this.$router.push('/houses')"
        />
        Back to detail page
      </p>
      <div class="flex">
        <div class="main-content background2">
          <div class="property-image">
            <img :src="house.image" width="100%" alt="Property Image" />
          </div>
          <div class="property-details">
            <div class="button-container" v-if="house.madeByMe">
              <a href="#" @click="editHouse" class="">
                <img
                  src="/ic_edit_white@3x.png"
                  class="primaryElement"
                  alt="Edit"
                  height="20"
                />
              </a>
              <a href="#" @click="showDialog" class="">
                <img src="/ic_delete@3x.png" alt="Delete" height="20" />
              </a>
            </div>
            <h1>{{ house.location.street }} {{ house.location.houseNumber }}</h1>
            <p>
              <img src="/ic_location@3x.png" height="20px" />{{ house.location.zip }}
              {{ house.location.city }}
            </p>
            <div class="">
              <p>
                &euro; {{ house.price }} <img src="/ic_size@3x.png" height="20px" />
                {{ house.size }} m²
                <img src="/ic_construction_date@3x.png" height="20px" /> built in
                {{ house.constructionYear }}
              </p>
            </div>
            <div class="">
              <p>
                <img src="/ic_bed@3x.png" height="20px" /> {{ house.rooms.bedrooms }}
                <img src="/ic_bath@3x.png" height="20px" /> {{ house.rooms.bathrooms }}
                <img src="/ic_garage@3x.png" height="20px" /> {{ house.hasGarage }}
              </p>
            </div>
            <p>{{ house.description }}</p>
          </div>
          <div class="favorite-container">
            <button class="button button-confirm" v-if="!isFavorite" @click="favorite">
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
    </div>
  </section>
</template>
<script>
import { houseStore } from "../../stores/houseStore";
export default {
  name: "viewHouse",
  setup() {
    const store = houseStore();
    return { store };
  },
  data() {
    return {
      house: {
        id: 0,
        price: 0,
        rooms: {
          bedrooms: 0,
          bathrooms: 0,
        },
        size: 0,
        description: "",
        location: {
          street: "",
          houseNumber: 0,
          numberAddition: "",
          zip: "",
          city: "",
        },
        madeByMe: false,
        createdAt: "",
        hasGarage: false,
      },
      visable: false,
      isFavorite: false,
    };
  },
  mounted() {
    this.fetchHouse();
  },
  methods: {
    async fetchHouse() { //fetches the house from the store
      const id = this.$route.params.id;
      this.house = await this.store.fetchHouse(id);
      //check if its favorite after the house is fetched with a wait
      this.isFavorite = this.store.favoriteHouses.some(
      (favoriteHouse) => favoriteHouse.id === this.house.id
    );
    },
    editHouse() { //go to the edit page
      this.$router.push("/houses/" + this.house.id + "/edit");
    },
    deleteHouse() { //delete the house
      this.store.deleteHouse(this.house.id);
      this.$router.push("/houses");
    },
    showDialog() { //show the delete dialog
      this.visable = true;
    },
    favorite() { //add or remove the house from the favorite list
      this.isFavorite = this.store.favoriteHouse(this.house);
    },
  },
};
</script>
<style scoped>
.property-details {
  position: relative;
}

.recommended {
  margin-left: 100px;
}

.property-details {
  padding: 20px;
}

.property-details p {
  margin: 5px 0;
}

.edit-delete-buttons {
  margin-top: 20px;
}

.property-image {
  position: relative;
}
</style>
