<script lang="ts">
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { auth } from '../../stores/auth';
  import {
    publishers,
    adminStatus,
    loading,
    userIsSignedIn,
    isRegistered,
  } from '../../stores/publishers';
  import { getSignedInUser } from '../../controllers/publishers';
  import { Lifesaver } from 'carbon-icons-svelte';
  import { Loading } from 'carbon-components-svelte';

  let publisher;

  onMount(async () => {
    onAuthStateChanged($auth, async (sameUser) => {
      if (sameUser) {
        userIsSignedIn.set(true);
      }
    });

    if ($auth.currentUser === null) {
      userIsSignedIn.set(false);
    } else {
      publisher = await getSignedInUser($auth.currentUser);
      isRegistered.set($publishers.some((e) => e.email === $auth.currentUser.email) ? true : false);
      adminStatus.set(publisher?.role === 0);
    }

    $loading = false;
  });
</script>

{#if $loading}
  <Loading />
{:else if !$loading && $userIsSignedIn && $isRegistered}
  <slot />
{:else if !$loading && !$userIsSignedIn}
  <div class="not-signed">
    <Lifesaver size={32} />
    <h2 class="text">501</h2>
  </div>
{:else if !$loading && !$isRegistered}
  <div class="not-signed">
    <h2 class="text">Please wait</h2>
    <p class="text">
      Your administrator is completing your registration. Please refresh your page after.
    </p>
  </div>
{/if}

<style>
  .text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .not-signed {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
  }
</style>
