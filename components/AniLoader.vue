<template>
  <div>
    <span>{{ getRandomKaomoji }}</span>
  </div>
</template>

<script>
export default {
  name: "AniLoader",
  created() { },
  data() {
    return {
      items: ["(^・ω・^ )", "〜(￣▽￣〜)", "(* ^ ω ^)", "(´ ∀ ` *)", "٩(◕‿◕｡)۶", "(o^▽^o)",
        "<(￣︶￣)>", "(⁀ᗢ⁀)", "ヽ(o＾▽＾o)ノ", "(o^ ^o)", "(つ﹏<)･ﾟ｡", "(ノ・∀・)ノ", "( ≧Д≦)",
        "\(✖╭╮✖)/", "╭∩╮(︶︿︶)╭∩╮", "(=^･^=)", "ʕ⁎̯͡⁎ʔ༄", "(ᓄಠ_ಠ)ᓄ", "(ᵕ≀ ̠ᵕ )", "(◡ ω ◡)"]
    };
  },
  computed: {
    getRandomKaomoji() {
      return this.items[Math.floor(Math.random() * (this.items.length))]
    }
  },
};
</script>

<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 50px;
}

span {
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
</style>