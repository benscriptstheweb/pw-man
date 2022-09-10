<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Pedestrian, Home, CalendarHeatMap, Map } from 'carbon-icons-svelte';
  import { Tag } from 'carbon-components-svelte';
  import { isRegistered, userIsSignedIn } from '../stores/publishers';
  import { page } from '$app/stores';

  export let publisherName: string;
  export let adminStatus = false;
  export let displayTag = false;

  let dispatch = createEventDispatcher();

  onMount(() => {
    if (publisherName === undefined) {
      publisherName = 'Unregistered User';
    }
  });

  const logoutUser = () => {
    dispatch('loggedOut');
  };

  const selectedRoute = (routeId: string) => {
    return $page.routeId === routeId ? 'border-bottom: 2px solid black' : '';
  };
</script>

<div class="container">
  <div class="btn-group">
    <div id="logout-user" on:click={logoutUser}>
      {#if !$isRegistered || !$userIsSignedIn}
        <div class="btn">
          <Home size={24} />
        </div>
      {:else}
        <div class="btn">
          <Pedestrian size={20} />
          <p>Logout</p>
        </div>
      {/if}
    </div>

    {#if $isRegistered && $userIsSignedIn}
      <div class="locators">
        <div class="btn" style={selectedRoute('shifts')}>
          <CalendarHeatMap size={20} />
          <p>Shifts</p>
        </div>
      </div>
      <div class="locators">
        <div class="btn">
          <Map size={20} />
          <p>Locations</p>
        </div>
      </div>
    {/if}
  </div>

  {#if displayTag}
    <div class="name-tag">
      {#if adminStatus}
        <Tag type="green">Admin</Tag>
      {:else}
        <Tag type="cyan">{publisherName}</Tag>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    cursor: pointer;
    transition: 0.2s;
    border-bottom: var(--is-selected);
  }

  .btn p {
    font-size: 12px;
  }

  .btn-group {
    display: flex;
    flex-direction: row;
  }

  .btn:hover {
    border-bottom: 2px solid black;
  }

  .name-tag {
    margin: 8px;
    align-self: flex-end;
  }
</style>
