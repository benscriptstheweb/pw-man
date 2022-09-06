<script>
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import { Button } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';

  export let adminStatus = false;

  const dispatch = createEventDispatcher();
  const formIsOpened = () => {
    dispatch('formIsOpened');
  };
</script>

<div class="banner">
  <div class="banner-text">
    {#if adminStatus}
      <h2>All Shifts</h2>
      <p>An overview of all shifts.</p>
    {:else}
      <h2>My Shifts</h2>
      <p>An overview of your shifts.</p>
    {/if}
  </div>
  <Button kind="tertiary" size="lg" on:click={formIsOpened}>
    <Add size={32} />
  </Button>
</div>

<style>
  :global(.banner button) {
    color: #4c7baa !important;
    border: 1px solid #4c7baa;
  }
  :global(.banner button:hover) {
    background-color: #364f67 !important;
    color: white !important;
  }
  :global(.banner svg) {
    font-weight: bold;
  }
  :global(.bx--btn--lg:not(.bx--btn--icon-only)) {
    align-items: center;
    padding: 10px;
  }
  .banner {
    display: flex;
    flex-direction: row;
    width: 300px;
    margin: 80px auto 40px auto;
  }
  .banner-text {
    padding-right: 30px;
    color: #5184b7;
  }
  .banner-text h2 {
    font-weight: bold;
  }
</style>
