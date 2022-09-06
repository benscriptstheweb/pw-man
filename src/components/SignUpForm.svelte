<script>
  import { createPublisher, getLatestPublisherId } from '../controllers/publishers';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import {
    Form,
    Button,
    RadioButton,
    RadioButtonGroup,
    ToastNotification,
    TextInput,
    FormGroup,
  } from 'carbon-components-svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import { auth } from '../stores/auth';

  export let toggleForm;

  let firstNameFieldEmpty = false;
  let lastNameFieldEmpty = false;
  let emailFieldEmpty = false;
  let passwordFieldEmpty = false;

  let firstName;
  let lastName;
  let email;
  let role;
  let password;

  const dispatch = createEventDispatcher();

  const submitSuccess = () => {
    dispatch('success', {
      success: true,
      hidden: true,
    });
  };

  const closeForm = () => {
    dispatch('close', true);
  };

  let latestId;

  const submitForm = async () => {
    firstNameFieldEmpty = firstName === '' ? true : false;
    lastNameFieldEmpty = lastName === '' ? true : false;
    emailFieldEmpty = email === '' ? true : false;
    passwordFieldEmpty = password === '' ? true : false;

    await createUserWithEmailAndPassword($auth, email, password);

    createPublisher({
      id: latestId + 1,
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: Number(role),
    });

    firstName = '';
    lastName = '';
    email = '';
    role = '';
    password = '';

    submitSuccess();
  };

  onMount(async () => {
    latestId = await getLatestPublisherId();
  });
</script>

<div transition:fly={{ y: 80 }} class="shift-form">
  <h4 style="margin-bottom: 20px">
    Create Account
    <div on:click={closeForm} class="shift-form-close">
      <Close />
    </div>
  </h4>

  <Form on:submit={(e) => e.preventDefault()}>
    <div class="notification">
      {#if firstNameFieldEmpty}
        <ToastNotification
          timeout={4000}
          on:close={(e) => {
            e.preventDefault();
            firstNameFieldEmpty = !firstNameFieldEmpty;
          }}
          lowContrast
          kind="error"
          title="Fill out the first name field." />
      {/if}
      {#if lastNameFieldEmpty}
        <ToastNotification
          timeout={4000}
          on:close={(e) => {
            e.preventDefault();
            lastNameFieldEmpty = !lastNameFieldEmpty;
          }}
          lowContrast
          kind="error"
          title="Fill out the last name field." />
      {/if}
    </div>

    <FormGroup legendText="Personal Info">
      <TextInput bind:value={firstName} placeholder="first name" />
      <TextInput bind:value={lastName} placeholder="last name" />
      <TextInput bind:value={email} placeholder="email" />
      <TextInput bind:value={password} type="password" placeholder="password" />
    </FormGroup>

    <FormGroup legendText="Type">
      <RadioButtonGroup bind:selected={role}>
        <RadioButton labelText="Brother" value="1" />
        <RadioButton labelText="Sister" value="2" />
      </RadioButtonGroup>
    </FormGroup>

    <Button type="submit" on:click={submitForm}>Submit</Button>
    <Button
      type="cancel"
      on:click={toggleForm}
      icon={Close}
      iconDescription="Cancel"
      kind="danger-tertiary">Cancel</Button>
  </Form>
</div>

<style>
  .shift-form {
    position: absolute;
    top: 100px;
    z-index: 1;
    width: 350px;
    transition: opacity 0.2s ease-in-out;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: white;
    padding: 30px;
  }
  .shift-form-close {
    float: right;
    cursor: pointer;
  }
</style>
