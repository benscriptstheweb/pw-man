<script lang="ts">
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { loading, userIsSignedIn, adminStatus } from '../stores/publishers';
  import { auth } from '../stores/auth';
  import Navbar from '../components/Navbar.svelte';
  import { getSignedInUser } from '../controllers/publishers';

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
      userIsSignedIn.set(false);
    } else {
      publisher = await getSignedInUser($auth.currentUser);
      adminStatus.set(publisher?.role === 0);
      publisherName = publisher?.text;
    }
  });

  $: showTag = publisher ? true : false;
</script>

{#if $auth.currentUser}
  <Navbar {publisherName} adminStatus={$adminStatus} displayTag={showTag} />
{/if}
<div class="content">
  <slot />
</div>

<style>
  .content {
    margin-top: 120px;
  }
</style>
