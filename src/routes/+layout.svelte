<script lang="ts">
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { userIsSignedIn, adminStatus } from '../stores/publishers';
  import { auth } from '../stores/auth';
  import Navbar from '../components/Navbar.svelte';
  import { getSignedInUser } from '../controllers/publishers';

  let publisherName: string;
  let publisher;

  onMount(async () => {
    onAuthStateChanged($auth, async (sameUser) => {
      if (sameUser) {
        userIsSignedIn.set(true);
      }
    });

    publisher = await getSignedInUser($auth.currentUser);
    adminStatus.set(publisher?.role === 0);
    publisherName = publisher?.text;
  });
</script>

{#if $auth.currentUser}
  <Navbar {publisherName} adminStatus={$adminStatus} />
{/if}
<div class="content">
  <slot />
</div>

<style>
  .content {
    margin-top: 120px;
  }
</style>
