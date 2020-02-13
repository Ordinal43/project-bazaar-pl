<template>
    <v-card class="rounded" hover
        :ripple="{ class: 'primary--text' }"
        :to="`stands/${item.id}`"
    >
        <v-img
            src="/assets/stand_placeholder.jpg"
            :aspect-ratio="4/3"
        ></v-img>

        <v-card-title class="title">
            {{ item.stand_name }}
        </v-card-title>
        <v-card-text class="grey--text text--darken-2 pt-0 stand-desc">
            {{ item.description }}
        </v-card-text>
        <v-card-text class="subheading accent--text">
            {{ item.products.length }} MENU
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style lang="scss" scoped>
    .stand-desc {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>