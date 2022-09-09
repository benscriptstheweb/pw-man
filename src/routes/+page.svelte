<script lang="ts">
  import SignOn from '../components/SignOn.svelte';
  import { goto } from '$app/navigation';

  const routeToShifts = () => {
    goto('/shifts');
  };
</script>

<SignOn on:signedInWithAuth={routeToShifts} />
