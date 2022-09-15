<script lang="ts">
  import SignOn from '../components/SignOn.svelte';
  import { goto } from '$app/navigation';
  import { auth } from '../stores/auth';
  import { onMount } from 'svelte';
  import { loading } from '../stores/publishers';
  import { Loading } from 'carbon-components-svelte';

  const routeToShifts = () => {
    goto('/shifts');
  };

  onMount(() => {
    $loading = true;
    
    if ($auth.currentUser) {
      routeToShifts();
    }

    $loading = false;
  });
</script>

{#if $loading}
  <Loading />
{:else if !$loading}
  <SignOn on:signedInWithAuth={routeToShifts} />
{/if}
