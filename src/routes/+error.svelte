<script lang="ts">
    import { Lifesaver } from 'carbon-icons-svelte';
</script>

<div class="not-signed">
    <Lifesaver size={32} />
    <div class="not-signed-text">
        <h2 class="text">404</h2>
    </div>
</div>

<style>
    .message {
    }
    .text {
        margin: 10px;
        padding: 10px;
    }
    .not-signed-text {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
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
</style>