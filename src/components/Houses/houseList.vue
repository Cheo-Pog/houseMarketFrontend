<!-- the hmr doest work for some reason, if you want to reload change the 'define' in the vite.config -->
<template>
  <section>
    <div class="container">
      <div class="flex flex-row">
        <h2 class="h2-mobile">Houses</h2>
        <button
          type="button"
          class="float-end button primaryElement rounded button-desktop"
          @click="this.$router.push('/houses/create')"
        >
          + CREATE NEW
        </button>
        <button
          type="button"
          class="float-end button button-mobile background1"
          @click="this.$router.push('/houses/create')"
        >
          <img src="/ic_plus_grey@3x.png" height="80%">
        </button>
      </div>
      <div id="filters" class="flex flex-column">
        <div class="search TertiaryElement1">
          <button class="searchIcon TertiaryElement1" @click="filterHouses">
            <img src="/ic_search@3x.png" height="34px" />
          </button>
          <input
            type="search"
            class="TertiaryElement1 input"
            v-model="search"
            placeholder="Search..."
            @input="handleInput"
          />
        </div>
        <div class="float-end buttons-mobile">
          <button class="button left-btn" @click="sort('Price')">Price</button>
          <button class="button right-btn" @click="sort('Size')">Size</button>
        </div>
      </div>
      <h2 v-if="filterCount != 0">{{ filterCount }} results</h2>
      <div class="margin-top">
        <HouseListItem
          v-for="house in houses"
          :key="house.id"
          :house="house"
          @delete="deleteHouse"
        />
      </div>
    </div>
    <div class="noFilterFound" v-if="visible">
      <img src="/img_empty_houses@3x.png" height="300px" />
      <h3>
        No houses found <br />
        Please try another keyword / other filters
      </h3>
    </div>
  </section>
</template>

<script>
import HouseListItem from "./HouseListItem.vue";
import { houseStore } from "../../stores/houseStore";

export default {
  name: "houseList",
  setup() {
    const store = houseStore();
    return { store };
  },
  components: {
    HouseListItem,
  },
  data() {
    return {
      houses: [],
      search: "",
      filterCount: 0,
      visible: false,
      isHistory: false,
      isFavorites: false,
      isMine: false,
    };
  },
  mounted() {
    this.mounted();
  },
  watch: {
    //to make sure that the houses change even if youre on the same page
    $route() {
      this.mounted();
    },
  },
  methods: {
    async mounted() {
      // you can add to this if you want to make more filters
      this.isHistory = window.location.href.includes("history");
      this.isFavorites = window.location.href.includes("favorites");
      this.isMine = window.location.href.includes("myListings");
      switch (true) {
        case this.isHistory:
          this.houses = await this.store.getHistory;
          break;
        case this.isFavorites:
          this.houses = await this.store.getFavoriteHouses;
          break;
        default:
          await this.fetchHouses();
      }
      //this is performed on the already existing houses array so its not included in the switch
      if (this.isMine){
        this.houses = this.houses.filter((house) => house.madeByMe === true);
      }

      if (this.houses.length === 0) {
        //check if the array is empty
            this.visible = true;
      }else{
        //otherwise make it false if it was true before
        this.visible = false;
      }
    },
    // fetch the houses from the API
    async fetchHouses() {
      this.houses = await this.store.fetchHouses();
    },
    //delete a house and filter the array
    async deleteHouse(id) {
      await this.store.deleteHouse(id);
      this.houses = this.houses.filter((house) => house.id !== id);
    },
    filterHouses() { //filter the houses based on the search
      this.houses = this.houses.filter((house) => {
        return (
          house.location.city.toLowerCase().includes(this.search.toLowerCase()) ||
          house.location.zip.toLowerCase().includes(this.search.toLowerCase()) ||
          house.location.street.toLowerCase().includes(this.search.toLowerCase())
        );
      });
      //set the filter count to the amount of houses
      this.filterCount = this.houses.length;
      //if the filter count is 0 show the noFilterFound div
      if (this.filterCount === 0) {
        this.visible = true;
      }
    },
    async handleInput() { //if the search is empty remove all the filters by fetching the houses again
      if (this.search === "") {
        this.houses = await this.store.fetchHouses();
        //reset the filter count and the visible
        this.filterCount = 0;
        this.visible = false;
      }
    },
    sort(sortBy) { //sort the houses based on the sortBy (for now only price and size)
      switch (sortBy) {
        case "Price":
          this.houses.sort((a, b) => a.price - b.price);
          break;
        case "Size":
          this.houses.sort((a, b) => a.size - b.size);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.noFilterFound {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.float-end {
  margin-left: auto;
  margin-bottom: 10px;
  margin-right: 20px;
}
.searchIcon {
  border: none;
}
.searchIcon:hover {
  cursor: pointer;
}

input[type="search"] {
  padding: 12px 5px 12px 0px;
  border: none;
}

.search {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #c3c3c3;
  border-radius: 4px;
  margin-right: 20px;
}

.margin-top {
  margin-top: 20px;
  margin-right: 20px;
}

.left-btn {
  border-radius: 10px 0 0 10px;
  background-color: #c3c3c3;
  width: 100px;
}

.left-btn:focus {
  background-color: #eb5440;
}

.right-btn {
  border-radius: 0 10px 10px 0;
  background-color: #c3c3c3;
  width: 100px;
}

.button-mobile {
  display: none;
}

.right-btn:focus {
  background-color: #eb5440;
}

.rounded {
  border-radius: 10px;
}

.input{
  width: 100%;
}

@media screen and (max-width: 520px) {
  .h2-mobile {
    display: block;
    margin-left: auto;
  }

  .button-mobile {
    display: flex;
    margin-left: 140px;
    margin-top: 10px
  }

  .button-desktop {
    display: none;
  }
  
  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-column{
    display: flex;
    flex-direction: column;
  }

  .buttons-mobile{
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    width: 100%;
  }

  .left-btn{
    width: 100%;
  }
  .right-btn{
    width: 100%;
  }

}
</style>
