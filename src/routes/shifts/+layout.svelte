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
  import { Campsite, UserMultiple } from 'carbon-icons-svelte';
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
</script>

<Navbar {publisherName} adminStatus={$adminStatus} on:loggedOut={logout} displayTag={false} />

{#if $loading}
  <Loading />
{:else if !$loading && $userIsSignedIn && $isRegistered}
  <slot />
{:else if !$loading && !$userIsSignedIn}
  <div class="not-signed">
    <Campsite size={32} />
    <p>Sorry, the page you are looking for is not available.</p>
  </div>
{:else if !$loading && !$isRegistered}
  <div class="not-signed">
    <UserMultiple size={32} />
    <p>Please wait for your administrator to complete your registration.</p>
  </div>
{/if}

<style>
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .not-signed {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
  }
  .not-signed p {
    margin-top: 20px;
  }
</style>
