<template>
  <div class="header background2">
    <router-link to="/" class="logo"
      ><img src="/img_logo_dtt@3x.png" height="40" />
    </router-link>
    <router-link to="/" class="logo-mobile"
      ><img src="/ic_mobile_navigarion_home@3x.png" height="40" />
    </router-link>
    <div class="menu">
      <router-link to="/houses" class="DesktopHeader houses">Houses</router-link>
      <router-link to="/houses/history" class="DesktopHeader">History</router-link>
      <router-link to="/houses/favorites" class="DesktopHeader">Favorites</router-link>
      <router-link to="/houses/myListings" class="DesktopHeader">My listings</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navigation",
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.header {
  overflow: hidden;
  padding: 20px 30%;
}

.header a {
  float: left;
  text-align: center;
  padding: 12px;
  line-height: 25px;
  border-radius: 4px;
}

.logo-mobile {
  display: none;
}

@media screen and (max-width: 520px) {
  .hamburger {
    display: block;
  }

  .menu {
    display: flex;
    flex-direction: column;
    background-color: #E8E8E8;
  }

  .houses {
    display: none;
  }

  .logo {
    display: none;
  }

  .logo-mobile {
    display: block;
  }
}

</style>
