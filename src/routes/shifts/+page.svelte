<script lang="ts">
  import ShiftForm from '../../components/ShiftForm.svelte';
  import LocationBanner from '../../components/LocationBanner.svelte';
  import Navbar from '../../components/Navbar.svelte';
  import ShiftList from '../../components/ShiftList.svelte';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { auth } from '../../stores/auth';
  import { onMount } from 'svelte';
  import { Campsite } from 'carbon-icons-svelte';
  import { goto } from '$app/navigation';
  import { Loading, ToastNotification } from 'carbon-components-svelte';
  import { getSignedInUser } from '../../controllers/publishers';

  const logout = async () => {
    signOut($auth);
    goto('/');
  };

  let hidden = true;

  const toggleForm = () => {
    hidden = !hidden;
  };

  let success = false;

  const submissionSucceeded = (event) => {
    success = event.detail.success;
    hidden = event.detail.hidden;
  };

  const closeForm = (event) => {
    hidden = event.detail;
  };

  let adminStatus;
  let publisher;
  let publisherName;
  let loading = true;
  let userIsSignedIn = false;

  onMount(async () => {
    onAuthStateChanged($auth, (sameUser) => {
      if (sameUser) {
        userIsSignedIn = true;
      }
    });

    publisher = await getSignedInUser($auth.currentUser);
    publisherName = publisher?.text;
    adminStatus = publisher?.role === 0;
    loading = false;
  });
</script>

<div class="success">
  {#if success}
    <ToastNotification
      timeout={4000}
      on:close={(e) => {
        e.preventDefault();
        success = !success;
      }}
      lowContrast
      kind="success"
      title="Shift Added!"
      caption="You now have this shift." />
  {/if}
</div>

{#if loading}
  <Loading />
{:else if !loading && userIsSignedIn}
  <div class="content">
    <Navbar {publisherName} {adminStatus} on:loggedOut={logout} />
    <LocationBanner {adminStatus} on:formIsOpened={toggleForm} />

    {#if !hidden}
      <ShiftForm {adminStatus} {toggleForm} on:success={submissionSucceeded} on:close={closeForm} />
    {/if}
    <ShiftList {adminStatus} />
  </div>
{:else if !loading && !userIsSignedIn}
  <div class="not-signed">
    <Campsite size={32} />
    <p>Sorry, the page you are looking for is not available.</p>
  </div>
{/if}

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
  .success {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
  }
</style>
