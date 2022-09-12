<script>
  import { Button, Form, Loading, TextInput, ToastNotification } from 'carbon-components-svelte';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import { auth } from '../stores/auth';
  import SignUpForm from './SignUpForm.svelte';
  import { createEventDispatcher } from 'svelte';

  let dispatch = createEventDispatcher();

  let email = '';
  let password = '';
  let loading = false;

  const login = () => {
    loading = true;

    signInWithEmailAndPassword($auth, email, password)
      .then(() => {
        email = '';
        password = '';

        dispatch('signedInWithAuth');
      })
      .catch(() => {
        loading = false;
      });
  };

  let hidden = true;

  const toggleForm = () => {
    hidden = !hidden;
  };

  const signup = () => {
    toggleForm();
  };

  const closeForm = (event) => {
    hidden = event.detail;
  };

  let success = false;

  const submissionSucceeded = (event) => {
    success = event.detail.success;
    hidden = event.detail.hidden;
  };
</script>

{#if loading}
  <Loading />
{/if}

{#if success}
  <div class="success">
    <ToastNotification
      timeout={4000}
      on:close={(e) => {
        e.preventDefault();
        success = !success;
      }}
      lowContrast
      kind="success"
      title="User Created!"
      caption="Please login after a minute." />
  </div>
{/if}

<div class="container">
  <div id="logo">
    <h1>Cart Manager</h1>
  </div>

  <div class="welcome-form">
    <Form on:submit={(e) => e.preventDefault()}>
      <div class="txt-inputs">
        <div class="txt-input">
          <TextInput bind:value={email} placeholder="email" />
        </div>

        <div class="txt-input">
          <TextInput type="password" bind:value={password} placeholder="password" />
        </div>
      </div>

      <div class="btn-group">
        <Button kind="ghost" type="submit" on:click={login} class="welcome-login">LOGIN</Button>
        <Button icon={Add} iconDescription="Sign-Up" on:click={signup} class="welcome-sign" />
      </div>
    </Form>
  </div>

  {#if !hidden}
    <SignUpForm {toggleForm} on:close={closeForm} on:success={submissionSucceeded} />
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 150px;
  }
  #logo {
    margin-bottom: 30px;
  }

  :global(.welcome-form button) {
    color: black;
    border: 1px solid black;
    margin: 10px;
    height: 10px;
    padding: 10px;
    align-self: flex-end;
  }
  :global(.welcome-form button:hover) {
    background-color: black;
    color: white !important;
  }
  :global(button.welcome-sign) {
    background-color: black !important;
    color: white;
  }
  :global(button.welcome-sign:hover) {
    background-color: #5184b7 !important;
    color: white;
  }

  :global(.welcome-form form) {
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .txt-inputs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .txt-input {
    margin: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .btn-group {
    align-self: baseline;
  }
  .success {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
  }
</style>
