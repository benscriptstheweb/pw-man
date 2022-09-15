<script lang="ts">
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { auth } from '../../stores/auth';
  import {
    publishers,
    adminStatus,
    userIsSignedIn,
    isRegistered,
  } from '../../stores/publishers';
  import { getSignedInUser } from '../../controllers/publishers';
  import { Lifesaver } from 'carbon-icons-svelte';
  import { Loading } from 'carbon-components-svelte';
  import Navbar from '../../components/Navbar.svelte';

  let publisherName: string;
  let publisher;

  let loading = true;

  onMount(async () => {
    onAuthStateChanged($auth, (sameUser) => {
      if (sameUser) {
        userIsSignedIn.set(true);
      }
    });
    
    // If routes are visited without authentication.
    if ($auth.currentUser !== null) {
      publisher = await getSignedInUser($auth.currentUser);
      isRegistered.set($publishers.some((e) => e.email === $auth.currentUser.email) ? true : false);
      
      publisherName = publisher.text;
      adminStatus.set(publisher.role === 0);
    }

    loading = false;
  });
</script>

{#if loading}
  <Loading />
{:else if !loading && $userIsSignedIn && $isRegistered}
  <Navbar {publisherName} adminStatus={$adminStatus} />
  <div class="content">
    <slot />
  </div>
{:else if !loading && !$userIsSignedIn}
  <div class="not-signed">
    <Lifesaver size={32} />
    <h2 class="text">501</h2>
  </div>
{:else if !loading && !$isRegistered}
  <div class="not-signed">
    <h2 class="text">Please wait</h2>
    <p class="text">
      Your administrator is completing your registration. Please refresh your page after.
    </p>
  </div>
{/if}

<style>
  .content {
    margin-top: 130px;
  }
  .text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 10px;
    padding: 10px;
  }
  .not-signed {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
  }
</style>
