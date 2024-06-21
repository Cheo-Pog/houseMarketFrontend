<template>
  <section>
    <div class="box">
      <div class="main-content">
        <p>
          <img
            src="/ic_back_grey@3x.png"
            class="button"
            height="10"
            @click="this.$router.push('/houses')"
          />Back to detail page
        </p>
        <h1 v-if="isEdit">Edit Listing</h1>
        <h1 v-else>Create Listing</h1>
        <form>
          <div class="form-group full">
            <label>Street name*</label>
            <input type="text" v-model="house.location.street" />
          </div>
          <div class="form-group half">
            <label>House number*</label>
            <input type="number" v-model="house.location.houseNumber" />
          </div>
          <div class="form-group half">
            <label>Addition (optional)</label>
            <input type="text" v-model="house.location.numberAddition" />
          </div>
          <div class="form-group full">
            <label>Postal code*</label>
            <input type="text" v-model="house.location.zip" />
          </div>
          <div class="form-group full">
            <label>City*</label>
            <input type="text" v-model="house.location.city" />
          </div>
          <div class="form-group full">
            <label>Upload picture (PNG or JPG)*</label>
            <input @input="showImg" type="file" accept="image/png, image/jpeg" />
            <img :src="this.house.image" class="uploaded-image" />
            <button type="button" class="button button-warning" @click="deleteImg">
              Remove
            </button>
          </div>
          <div class="form-group full">
            <label>Price*</label>
            <input type="number" v-model="house.price" />
          </div>
          <div class="form-group half">
            <label>Size*</label>
            <input type="number" v-model="house.size" />
          </div>
          <div class="form-group half">
            <label>Garage*</label>
            <select v-model="house.hasGarage">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div class="form-group half">
            <label>Bedrooms*</label>
            <input type="number" v-model="house.rooms.bedrooms" />
          </div>
          <div class="form-group half">
            <label>Bathrooms*</label>
            <input type="number" v-model="house.rooms.bathrooms" />
          </div>
          <div class="form-group full">
            <label>Construction date*</label>
            <input type="date" v-model="house.createdAt" />
          </div>
          <div class="form-group full">
            <label>Description*</label>
            <textarea v-model="house.description"></textarea>
          </div>
          <div class="alert" v-if="errorMessage">{{ errorMessage }}</div>
          <button type="button" class="btn btn-primary" v-if="isEdit" @click="submit()">
            Save
          </button>
          <button type="button" class="btn btn-primary" v-else @click="submit()">
            Create
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "../../axios-auth";
import { houseStore } from "../../stores/houseStore";

export default {
  name: "editHouse",
  props: {
    id: Number,
  },
  data() {
    return {
      house: {
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
        image: "",
        createdAt: "",
        hasGarage: false,
      },
      isEdit: false,
      uploadedImg: "",
      errorMessage: "",
      formData: new FormData(),
    };
  },
  setup() {
    const store = houseStore();
    return { store };
  },
  mounted() {
    this.isEdit = window.location.href.includes("edit"); //check if the url includes edit
    if (this.isEdit) {
      this.fetchHouse();
    }
  },
  methods: {
    async fetchHouse() {
      //grab the house from the API
      const id = this.$route.params.id;
      this.house = await this.store.fetchHouse(id);
    },
    check() {
      //checks for nulls or empties
      if (
        this.house.price === 0 ||
        this.house.rooms.bedrooms === 0 ||
        this.house.rooms.bathrooms === 0 ||
        this.house.size === 0 ||
        this.house.location.street === "" ||
        this.house.location.houseNumber === 0 ||
        this.house.location.zip === "" ||
        this.house.location.city === "" ||
        this.house.createdAt === "" ||
        this.house.description === ""
      ) {
        this.errorMessage = "Please fill in all fields";
        return false;
      }
      return true;
    },
    async submit() {
      if (!this.check()) {
        //check for nulls or empties
        return;
      }
      const id = this.$route.params.id;
      const url = this.isEdit ? `/houses/${id}` : "/houses"; //change the url based on the isEdit
      try {
        const response = await axios.post(url, {
          price: this.house.price,
          bedrooms: this.house.rooms.bedrooms,
          bathrooms: this.house.rooms.bathrooms,
          size: this.house.size,
          streetName: this.house.location.street,
          houseNumber: this.house.location.houseNumber,
          numberAddition: this.house.location.numberAddition,
          zip: this.house.location.zip,
          city: this.house.location.city,
          constructionYear: this.house.createdAt.split("-")[0],
          hasGarage: this.house.hasGarage,
          description: this.house.description,
        });
        if (this.isEdit) { //if its an edit use the id from the route
          await this.uploadImg(id);
        } else { //otherwise use the id from the response
          await this.uploadImg(response.data.id);
        }
        this.$router.push("/houses");
      } catch (error) {
        this.errorMessage = error;
      }
    },
    showImg(event) {
      this.formData = new FormData(); //reset the form data
      const file = event.target.files[0]; //grab the file from the event
      this.formData.append("image", file); // use "image" to match Postman
      this.house.image = URL.createObjectURL(file); //set the image
    },
    async deleteImg() { //reset the FormData and the image
      this.formData = new FormData();
      this.house.image = "";
    },
    async uploadImg(id) {
      try { //use the stored Formdata to upload the image
        await axios.post(`/houses/${id}/upload`, this.formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.alert {
  padding: 20px;
  background-color: #f44336;
  color: white;
}

.main-content {
  margin-right: 200px;
}

.box {
  width: 30%;
  margin: 0, 0;
  max-width: 1200px;
  padding-left: 100px;
}

h1 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.full {
  display: block;
}

.half {
  display: inline-block;
  width: 48%;
  margin-right: 2%;
}

.half:last-child {
  margin-right: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.uploaded-image {
  display: block;
  margin-top: 10px;
  max-width: 100%;
  height: auto;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
}

.btn-primary {
  margin-top: 20px;
}

.background-img {
  background: #f5f5f5;
  padding: 50px 0;
}

@media (max-width: 768px) {
  .container {
    width: 90%;
  }

  .half {
    display: block;
    width: 100%;
    margin-right: 0;
  }
}
</style>
