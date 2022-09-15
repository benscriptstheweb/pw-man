<script lang="ts">
  import SignOn from '../components/SignOn.svelte';
  import { goto } from '$app/navigation';
  import { auth } from '../stores/auth';
  import { onMount } from 'svelte';

  const routeToShifts = () => {
    goto('/shifts');
  };

  onMount(() => {
    if ($auth.currentUser) {
      routeToShifts();
    }
  });
</script>

<SignOn on:signedInWithAuth={routeToShifts} />
