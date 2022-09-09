<script lang="ts">
  import { onAuthStateChanged, signOut } from 'firebase/auth';
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
  import Navbar from '../../components/Navbar.svelte';
  import { goto } from '$app/navigation';
  import { Lifesaver } from 'carbon-icons-svelte';
  import { Loading } from 'carbon-components-svelte';

  const logout = async () => {
    signOut($auth);
    goto('/');
  };

  let publisherName: string;
  let publisher;

  $loading = true;

  onMount(async () => {
    onAuthStateChanged($auth, async (sameUser) => {
      if (sameUser) {
        userIsSignedIn.set(true);
      }
    });

    if ($auth.currentUser === null) {
      $userIsSignedIn = false;
    } else {
      publisher = await getSignedInUser($auth.currentUser);
      $isRegistered = $publishers.some((e) => e.email === $auth.currentUser.email) ? true : false;
      $adminStatus = publisher?.role === 0;
      publisherName = publisher?.text;
    }

    $loading = false;
  });

  $: showTag = publisher ? true : false;
</script>

<Navbar {publisherName} adminStatus={$adminStatus} on:loggedOut={logout} displayTag={showTag} />

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
    <p class="text">Your administrator is completing your registration. Please refresh your page after.</p>
  </div>
{/if}

<style>
  .not-signed {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
  }
  .text {
        margin: 10px;
        width: 250px;
    }
</style>
