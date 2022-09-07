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
  <div on:click={formIsOpened} class="add-shift">
    <Add size={32} />
  </div>
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
    align-items: center;
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
  .add-shift {
    border-radius: 10px;
    transition: 0.2s;
    background-color: #5184b7;
    color: white;
    cursor: pointer;
  }
  .add-shift:hover {
    transform: scale(1.1);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
</style>
