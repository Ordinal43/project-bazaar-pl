<template>
    <v-card class="rounded" hover
        :ripple="{ class: 'primary--text' }"
        :to="`stands/${item.id}`"
    >
        <v-img
        src="/assets/stand_placeholder.jpg"
        height="180"
        ></v-img>

        <v-card-title>
            <span class="headline">{{ item.name }}</span>
        </v-card-title>
        <v-card-text class="grey--text text--darken-2 pt-0">
            {{ item.description }}
        </v-card-text>
        <v-card-text class="title blue--text">
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
